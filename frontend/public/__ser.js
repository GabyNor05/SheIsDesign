window.__ser = function (root, opts = {}) {
  const R = (v) => Math.round(v * 10) / 10;
  const rgba = (s, keep) => {
    if (s && /transparent/.test(s) && keep) return [0, 0, 0, 0];
    const m = s && s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    const a = p.length > 3 ? p[3] : 1;
    if (a === 0 && !keep) return null;
    return [p[0], p[1], p[2], R(a * 100) / 100];
  };
  const splitTop = (s) => { const out = []; let d = 0, cur = ''; for (const ch of s) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && d === 0) { out.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; };
  const grad = (s) => {
    const res = [];
    const re = /(linear|radial)-gradient\(/g; let m;
    while ((m = re.exec(s))) {
      let i = m.index + m[0].length, d = 1, st = i;
      while (d && i < s.length) { if (s[i] === '(') d++; if (s[i] === ')') d--; i++; }
      const parts = splitTop(s.slice(st, i - 1));
      let ang = 180, first = parts[0];
      if (m[1] === 'linear') { if (/deg/.test(first)) { ang = parseFloat(first); parts.shift(); } else if (/^to /.test(first)) { const map = { 'to right': 90, 'to left': 270, 'to bottom': 180, 'to top': 0 }; ang = map[first] ?? 180; parts.shift(); } }
      else if (!/rgb|#/.test(first)) parts.shift();
      const stops = parts.map((p, k) => { const c = rgba(p, 1); const pm = p.match(/(?:\)|transparent)\s*([\d.]+)%/); return c ? [c, pm ? R(parseFloat(pm[1]) / 100) : (parts.length > 1 ? R(k / (parts.length - 1)) : 0)] : null; }).filter(Boolean);
      if (stops.length) res.push({ g: m[1][0], a: ang, s: stops });
    }
    return res;
  };
  const shadows = (s) => { if (!s || s === 'none') return null; return splitTop(s).map(p => { const c = rgba(p); const nums = p.replace(/rgba?\([^)]*\)/, '').trim().split(/\s+/).filter(x => /px|^0$/.test(x)).map(parseFloat); return c ? { c, x: nums[0] || 0, y: nums[1] || 0, b: nums[2] || 0, s: nums[3] || 0, i: /inset/.test(p) ? 1 : 0 } : null; }).filter(Boolean); };
  const visible = (el, cs) => cs.display !== 'none' && cs.visibility !== 'hidden' && !(parseFloat(cs.opacity) < 0.02 && !opts.forceOpacity);
  const nameOf = (el) => { const c = (el.getAttribute('class') || '').split(/\s+/).find(x => x && !/^(w-|h-|p[xytblr]?-|m[xytblr]?-|flex|grid|gap-|items-|justify-|text-|bg-|md:|lg:|sm:|relative|absolute|overflow)/.test(x)); return c || el.getAttribute('aria-label') || el.tagName.toLowerCase(); };
  const isInlineOnly = (el) => { for (const ch of el.childNodes) { if (ch.nodeType === 1) { const d = getComputedStyle(ch).display; if (!/inline/.test(d) || ch.tagName === 'svg' || ch.tagName === 'IMG' || ch.tagName === 'INPUT' || ch.tagName === 'BUTTON' || ch.children.length && !isInlineOnly(ch)) return false; const cs = getComputedStyle(ch); if (rgba(cs.backgroundColor) || parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.paddingLeft) > 2) return false; } } return true; };
  const font = (cs) => { const f = { w: +cs.fontWeight, z: R(parseFloat(cs.fontSize)), c: rgba(cs.color) || [255, 255, 255, 1] }; const lh = parseFloat(cs.lineHeight); if (!isNaN(lh)) f.l = R(lh); const ls = parseFloat(cs.letterSpacing); if (ls) f.k = R(ls); if (cs.textTransform !== 'none') f.t = cs.textTransform[0]; if (cs.fontStyle === 'italic') f.i = 1; if (cs.textAlign === 'center') f.a = 'c'; else if (cs.textAlign === 'right' || cs.textAlign === 'end') f.a = 'r'; if (/underline/.test(cs.textDecorationLine)) f.u = 1; const fam = cs.fontFamily.split(',')[0].replace(/['"]/g, '').trim(); if (fam !== 'Poppins') f.f = fam; const gc = cs.backgroundClip === 'text' || cs.webkitBackgroundClip === 'text'; if (gc) { const g = grad(cs.backgroundImage); if (g.length) f.g = g[0]; } return f; };
  function walk(el, pr, depth) {
    const cs = getComputedStyle(el);
    if (!visible(el, cs)) return null;
    const r = el.getBoundingClientRect();
    if ((r.width < 0.5 || r.height < 0.5) && cs.overflow !== 'visible') return null;
    if (r.width < 0.5 && r.height < 0.5) return null;
    if (r.right <= 0 || r.left >= (opts.vw || window.innerWidth)) return null;
    const n = { n: nameOf(el), x: R(r.left - pr.left), y: R(r.top - pr.top), w: R(r.width), h: R(r.height) };
    const tm = cs.transform && cs.transform.match(/matrix\(([^)]+)\)/);
    if (tm && el.tagName !== 'svg') { const [a, b] = tm[1].split(',').map(Number); const ang = Math.atan2(b, a) * 180 / Math.PI; if (Math.abs(ang) > 0.5 && el.offsetWidth) { n.rot = R(ang); n.cx = R(r.left + r.width / 2 - pr.left); n.cy = R(r.top + r.height / 2 - pr.top); n.w = el.offsetWidth; n.h = el.offsetHeight; } }
    const op = parseFloat(cs.opacity); if (op < 0.99 && !(opts.forceOpacity && op < 0.02)) n.o = R(op);
    const pcs = el.parentElement && getComputedStyle(el.parentElement); if (pcs && /flex/.test(pcs.display) && parseFloat(cs.flexGrow) > 0) n.gr = 1;
    const fills = []; const bg = rgba(cs.backgroundColor); if (bg) fills.push(bg);
    if (cs.backgroundImage && cs.backgroundImage !== 'none' && !(cs.backgroundClip === 'text' || cs.webkitBackgroundClip === 'text')) { for (const g of grad(cs.backgroundImage).reverse()) fills.push(g); const u = cs.backgroundImage.match(/url\(["']?([^"')]+)/); if (u) { n.img = u[1]; n.fit = cs.backgroundSize === 'contain' ? 'FIT' : 'FILL'; } }
    if (fills.length) n.f = fills;
    const rw = el.offsetWidth || r.width, rh = el.offsetHeight || r.height; const rad = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].map(k => { const v = cs['border' + k + 'Radius']; const px = /%/.test(v) ? parseFloat(v) * Math.min(rw, rh) / 100 : parseFloat(v) || 0; return Math.min(px, Math.min(rw, rh) / 2); });
    if (rad.some(v => v)) n.r = rad.every(v => v === rad[0]) ? R(rad[0]) : rad.map(R);
    const bw = ['Top', 'Right', 'Bottom', 'Left'].map(k => cs['border' + k + 'Style'] !== 'none' ? parseFloat(cs['border' + k + 'Width']) : 0);
    if (bw.some(v => v)) { const k = ['Top', 'Right', 'Bottom', 'Left'][bw.findIndex(v => v)]; const c = rgba(cs['border' + k + 'Color']); if (c) n.b = { c, w: bw.every(v => v === bw[0]) ? bw[0] : bw }; }
    const sh = shadows(cs.boxShadow); if (sh && sh.length) n.s = sh;
    const bf = cs.backdropFilter || cs.webkitBackdropFilter; if (bf && bf !== 'none') { const m = bf.match(/blur\(([\d.]+)px/); if (m) n.bb = +m[1]; }
    const fl = cs.filter; if (fl && fl !== 'none') { const m = fl.match(/blur\(([\d.]+)px/); if (m) n.lb = +m[1]; }
    if (cs.overflow !== 'visible' || cs.overflowX !== 'visible') n.cl = 1;
    if (cs.position === 'absolute' || cs.position === 'fixed') n.abs = 1;
    // leaf types
    if (el.tagName === 'svg') { const c = el.cloneNode(true); c.setAttribute('width', r.width); c.setAttribute('height', r.height); const col = cs.color; c.querySelectorAll('*').forEach(x => { const xs = getComputedStyle(el.querySelector(x.tagName) || el); }); let s = c.outerHTML.replace(/currentColor/g, col); if (!/fill=/.test(c.getAttribute('fill') || 'x') && !c.getAttribute('fill') && !/fill=/.test(s.slice(0, 200))) { } n.t = 'S'; n.svg = s.length < 6000 ? s : null; delete n.f; return n; }
    if (el.tagName === 'IMG') { n.t = 'I'; n.img = el.currentSrc || el.src; n.fit = cs.objectFit === 'contain' ? 'FIT' : 'FILL'; return n; }
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
      n.t = 'F'; const v = el.tagName === 'SELECT' ? (el.options[el.selectedIndex] || {}).text : (el.value || el.placeholder || '');
      if (v && el.type !== 'checkbox' && el.type !== 'radio' && el.type !== 'file') { const ph = !el.value && el.placeholder; const pcs = ph ? getComputedStyle(el, '::placeholder') : cs; const f = font(pcs); const pl = parseFloat(cs.paddingLeft), pt = parseFloat(cs.paddingTop), pb = parseFloat(cs.paddingBottom); n.c = [{ t: 'T', n: ph ? 'placeholder' : 'value', x: pl, y: R((r.height - (f.l || f.z * 1.4)) / 2), w: R(r.width - pl - parseFloat(cs.paddingRight)), h: f.l || R(f.z * 1.4), s: [[el.type === 'password' && el.value ? '••••••••' : v, f]], one: 1 }]; }
      return n;
    }
    const kids = [];
    if (isInlineOnly(el) && el.textContent.trim()) {
      const segs = []; const add = (node, st) => { for (const ch of node.childNodes) { if (ch.nodeType === 3) { const t = ch.textContent.replace(/\s+/g, ' '); if (t) segs.push([t, font(st)]); } else if (ch.nodeType === 1) { if (ch.tagName === 'BR') segs.push(['\n', font(st)]); else add(ch, getComputedStyle(ch)); } } };
      add(el, cs);
      if (segs.length) { segs[0][0] = segs[0][0].replace(/^ /, ''); segs[segs.length - 1][0] = segs[segs.length - 1][0].replace(/ $/, ''); }
      const range = document.createRange(); range.selectNodeContents(el); const tr = range.getBoundingClientRect();
      const lines = Math.round(tr.height / (parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4));
      const tn = { t: 'T', n: n.n, x: R(tr.left - r.left), y: R(tr.top - r.top), w: R(tr.width) + 1, h: R(tr.height), s: segs }; if (lines <= 1) tn.one = 1;
      const plain = !n.f && !n.b && !n.s && !n.r;
      if (plain) { tn.x = R(tr.left - pr.left); tn.y = R(tr.top - pr.top); if (n.o) tn.o = n.o; if (n.abs) tn.abs = 1; if (n.gr) { tn.gr = 1; tn.x = n.x; tn.w = n.w; tn.one = 0; } return tn; }
      kids.push(tn); n.t = 'F'; n.c = kids; n.text = 1; return n;
    }
    for (const ch of el.childNodes) {
      if (ch.nodeType === 3) { const t = ch.textContent.replace(/\s+/g, ' ').trim(); if (t) { const range = document.createRange(); range.selectNodeContents(ch); const tr = range.getBoundingClientRect(); if (tr.width) kids.push({ t: 'T', n: t.slice(0, 30), x: R(tr.left - r.left), y: R(tr.top - r.top), w: R(tr.width) + 1, h: R(tr.height), s: [[t, font(cs)]], one: tr.height < parseFloat(cs.fontSize) * 2 ? 1 : 0 }); } }
      else if (ch.nodeType === 1) { const k = walk(ch, r, depth + 1); if (k) kids.push(k); }
    }
    n.t = 'F';
    if (kids.length > 1 && kids.every(k => k.t === 'T' && k.s.length === 1 && k.s[0][0].length <= 2)) { const f0 = JSON.stringify(kids[0].s[0][1]); if (kids.every(k => JSON.stringify(k.s[0][1]) === f0)) { const f = kids[0].s[0][1]; delete f.a; const tn = { t: 'T', n: n.n, x: n.x, y: n.y + kids[0].y, w: n.w + 2, h: kids[0].h, s: [[kids.map(k => k.s[0][0]).join(''), f]], one: 1 }; if (n.abs) tn.abs = 1; return tn; } }
    if (/flex/.test(cs.display) && kids.length > 1 && !kids.some(k => k.abs)) {
      n.L = { d: cs.flexDirection.startsWith('column') ? 'V' : 'H', g: R(parseFloat(cs.columnGap === 'normal' ? 0 : (cs.flexDirection.startsWith('column') ? cs.rowGap : cs.columnGap)) || 0), p: ['Top', 'Right', 'Bottom', 'Left'].map(k => R(parseFloat(cs['padding' + k]) + (parseFloat(cs['border' + k + 'Width']) || 0))), j: cs.justifyContent, a: cs.alignItems, wr: cs.flexWrap === 'wrap' ? 1 : 0 };
    }
    // collapse pointless wrappers
    if (kids.length === 1 && !n.f && !n.b && !n.s && !n.cl && !n.o && kids[0].w === n.w && kids[0].h === n.h && kids[0].x === 0 && kids[0].y === 0) { const k = kids[0]; k.x = n.x; k.y = n.y; if (n.abs) k.abs = 1; return k; }
    if (kids.length) n.c = kids;
    if (!kids.length && !n.f && !n.b && !n.s && !n.img) return null;
    return n;
  }
  const r0 = root.getBoundingClientRect();
  const out = walk(root, { left: r0.left, top: r0.top }, 0);
  if (out) { out.x = 0; out.y = 0; }
  const FT = [], FK = {};
  const dedupe = (n) => { if (n.t === 'T') n.s = n.s.map(([t, f]) => { const k = JSON.stringify(f); if (!(k in FK)) { FK[k] = FT.length; FT.push(f); } return [t, FK[k]]; }); (n.c || []).forEach(dedupe); };
  if (out) dedupe(out);
  return JSON.stringify({ F: FT, T: out });
};
'ok'
