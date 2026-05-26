import { useState, useEffect } from "react";
import "./ManageDonationsPage.css";

// ─────────────────────────────────────────────────────────────────────────────
// API CONNECTION POINT
// 🔌 Replace fetchDonations() with your real API call when ready
// Expected shape: array of donation objects (see MOCK_DONATIONS below)
// e.g. const res = await fetch("/api/donations", {
//        headers: { Authorization: `Bearer ${token}` }
//      });
//      return await res.json();
// ─────────────────────────────────────────────────────────────────────────────
async function fetchDonations() {
  return MOCK_DONATIONS;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — mirrors what the frontend DonatePage collects
// Allocation splits match the frontend: 55% Events, 30% Resources, 15% Workshops
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_DONATIONS = [
  { id: 1,  name: "Ayasha Dlamini",  email: "a.dlamini@uct.ac.za",    amount: 500,   fund: "General Fund", type: "member",    date: "26 May 2026", color: "#C41262" },
  { id: 2,  name: "Anonymous",       email: null,                       amount: 250,   fund: "General Fund", type: "anonymous", date: "25 May 2026", color: null      },
  { id: 3,  name: "Zanele Mokoena",  email: "z.mokoena@uj.ac.za",     amount: 1000,  fund: "General Fund", type: "member",    date: "24 May 2026", color: "#60A5FA" },
  { id: 4,  name: "Anonymous",       email: null,                       amount: 100,   fund: "General Fund", type: "anonymous", date: "23 May 2026", color: null      },
  { id: 5,  name: "Priya Naidoo",    email: "p.naidoo@ukzn.ac.za",    amount: 2500,  fund: "General Fund", type: "member",    date: "22 May 2026", color: "#22C55E" },
  { id: 6,  name: "Nomvula Khumalo", email: "n.khumalo@wits.ac.za",   amount: 500,   fund: "General Fund", type: "member",    date: "21 May 2026", color: "#a78bfa" },
  { id: 7,  name: "Anonymous",       email: null,                       amount: 5000,  fund: "General Fund", type: "anonymous", date: "20 May 2026", color: null      },
  { id: 8,  name: "Lerato Sithole",  email: "l.sithole@tut.ac.za",    amount: 250,   fund: "General Fund", type: "member",    date: "18 May 2026", color: "#34d399" },
  { id: 9,  name: "Thandeka Zulu",   email: "t.zulu@dut.ac.za",       amount: 100,   fund: "General Fund", type: "member",    date: "17 May 2026", color: "#f97316" },
  { id: 10, name: "Anonymous",       email: null,                       amount: 1000,  fund: "General Fund", type: "anonymous", date: "16 May 2026", color: null      },
  { id: 11, name: "Chidi Okonkwo",   email: "c.okonkwo@cput.ac.za",   amount: 500,   fund: "General Fund", type: "member",    date: "15 May 2026", color: "#fb7185" },
  { id: 12, name: "Amara Diallo",    email: "a.diallo@nmu.ac.za",     amount: 750,   fund: "General Fund", type: "member",    date: "14 May 2026", color: "#FBBF24" },
  { id: 13, name: "Anonymous",       email: null,                       amount: 2500,  fund: "General Fund", type: "anonymous", date: "12 May 2026", color: null      },
  { id: 14, name: "Keabetswe Molefe",email: "keab@nwu.ac.za",         amount: 250,   fund: "General Fund", type: "member",    date: "10 May 2026", color: "#60A5FA" },
  { id: 15, name: "Anonymous",       email: null,                       amount: 100,   fund: "General Fund", type: "anonymous", date: "8 May 2026",  color: null      },
];

// Allocation breakdown — matches the frontend DonatePage exactly
const ALLOCATION = [
  { label: "Events & Competitions", pct: 55 },
  { label: "Student Resources",     pct: 30 },
  { label: "Community Workshops",   pct: 15 },
];

const PAGE_SIZE = 10;

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICON COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function Ic({ n, s = 16, c = "currentColor" }) {
  const paths = {
    heart:    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    users:    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    eye:      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    search:   <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    close:    <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    user:     <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    anon:     <><circle cx="12" cy="8" r="4"/><path d="M12 14c-5 0-8 2.5-8 4v1h16v-1c0-1.5-3-4-8-4z"/><line x1="18" y1="6" x2="6" y2="18"/></>,
    bar:      <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[n] || null}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FORMAT HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function fmtAmount(n) {
  return `R ${n.toLocaleString("en-ZA")}`;
}

function initials(name) {
  if (name === "Anonymous") return "?";
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL DRAWER
// ─────────────────────────────────────────────────────────────────────────────
function DonationDrawer({ donation, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const isAnon = donation.type === "anonymous";

  return (
    <div className="dn-drawer-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dn-drawer">
        <div className="dn-drawer__header">
          <h3 className="dn-drawer__title">Donation Details</h3>
          <button className="dn-drawer__close" onClick={onClose}>
            <Ic n="close" s={13} c="currentColor" />
          </button>
        </div>

        <div className="dn-drawer__body">
          {/* Amount — hero */}
          <div className="dn-drawer__amount">
            <div className="dn-drawer__amount-value">{fmtAmount(donation.amount)}</div>
            <div className="dn-drawer__amount-label">{donation.fund}</div>
          </div>

          {/* Avatar */}
          <div className="dn-drawer__avatar-wrap">
            <div
              className={`dn-drawer__avatar${isAnon ? " dn-avatar--anon" : ""}`}
              style={!isAnon ? { background: `${donation.color}22`, color: donation.color } : {}}
            >
              {isAnon ? <Ic n="user" s={22} c="rgba(255,255,255,0.25)" /> : initials(donation.name)}
            </div>
          </div>
          <p className="dn-drawer__name">{donation.name}</p>
          <p className="dn-drawer__email">{isAnon ? "No account linked" : donation.email}</p>

          <div className="dn-drawer__pills">
            <span className="dn-type-pill" style={
              isAnon
                ? { background: "#1E1E1E", color: "rgba(255,255,255,0.45)", borderColor: "#3A3A3A" }
                : { background: "rgba(196,18,98,0.1)", color: "#FE4081", borderColor: "rgba(196,18,98,0.3)" }
            }>
              <Ic n={isAnon ? "anon" : "user"} s={11} c="currentColor" />
              {isAnon ? "Anonymous" : "Member"}
            </span>
          </div>

          {/* Details */}
          <div style={{ marginBottom: 20 }}>
            <p className="dn-drawer__section-title">Donation Info</p>
            {[
              { label: "Amount",  value: fmtAmount(donation.amount) },
              { label: "Fund",    value: donation.fund              },
              { label: "Date",    value: donation.date              },
              { label: "Donor",   value: donation.name              },
              ...(donation.email ? [{ label: "Email", value: donation.email }] : []),
            ].map(r => (
              <div key={r.label} className="dn-drawer__row">
                <span className="dn-drawer__row-label">{r.label}</span>
                <span className="dn-drawer__row-value">{r.value}</span>
              </div>
            ))}
          </div>

          {/* Allocation breakdown */}
          <div>
            <p className="dn-drawer__section-title">How this donation is split</p>
            {ALLOCATION.map(a => {
              const allocated = Math.round((donation.amount * a.pct) / 100);
              return (
                <div key={a.label} className="dn-drawer__alloc-item">
                  <div className="dn-drawer__alloc-top">
                    <span className="dn-drawer__alloc-label">{a.label}</span>
                    <span className="dn-drawer__alloc-pct">
                      {fmtAmount(allocated)} · {a.pct}%
                    </span>
                  </div>
                  <div className="dn-drawer__alloc-bar">
                    <div className="dn-drawer__alloc-fill" style={{ width: `${a.pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ManageDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [typeFilter,setTypeFilter]= useState("all"); // all | member | anonymous
  const [sortBy,    setSortBy]    = useState("date"); // date | amount
  const [page,      setPage]      = useState(1);
  const [selected,  setSelected]  = useState(null);

  // 🔌 API CONNECTION: swap fetchDonations() for real call
  useEffect(() => {
    setLoading(true);
    fetchDonations()
      .then(data => setDonations(data))
      .catch(err => console.error("Failed to load donations:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setPage(1); }, [search, typeFilter, sortBy]);

  // ── Filtering + sorting
  const filtered = donations
    .filter(d => {
      const matchType   = typeFilter === "all" || d.type === typeFilter;
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
                       || (d.email && d.email.toLowerCase().includes(search.toLowerCase()));
      return matchType && matchSearch;
    })
    .sort((a, b) => sortBy === "amount" ? b.amount - a.amount : new Date(b.date) - new Date(a.date));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Summary stats
  const totalRaised   = donations.reduce((s, d) => s + d.amount, 0);
  const totalDonors   = donations.length;
  const uniqueMembers = donations.filter(d => d.type === "member").length;
  const avgDonation   = donations.length > 0 ? Math.round(totalRaised / donations.length) : 0;

  const STATS = [
    { icon: "heart",    label: "Total Raised",    value: fmtAmount(totalRaised) },
    { icon: "users",    label: "Total Donations",  value: totalDonors            },
    { icon: "user",     label: "Named Donors",     value: uniqueMembers          },
    { icon: "trending", label: "Avg Donation",     value: fmtAmount(avgDonation) },
  ];

  // ── Export CSV (basic)
  function handleExport() {
    const rows = [
      ["Name", "Email", "Amount (R)", "Fund", "Type", "Date"],
      ...donations.map(d => [
        d.name, d.email ?? "", d.amount, d.fund, d.type, d.date
      ]),
    ];
    const csv  = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "sheisdesign-donations.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="dn-root">

      {/* ── Page header */}
      <div className="dn-header dn-anim" style={{ animationDelay: "0ms" }}>
        <div>
          <p className="dn-header__eyebrow">
            <span className="dn-header__eyebrow-line" />
            Admin · Donations
          </p>
          <h1 className="dn-header__title">Donations</h1>
          <p className="dn-header__sub">Track all contributions to the SheIsDesign community fund.</p>
        </div>
        <button className="dn-export-btn" onClick={handleExport}>
          <Ic n="download" s={14} c="currentColor" /> Export CSV
        </button>
      </div>

      {/* ── Stats */}
      <div className="dn-stats dn-anim" style={{ animationDelay: "60ms" }}>
        {STATS.map(s => (
          <div key={s.label} className="dn-stat">
            <div className="dn-stat__icon">
              <Ic n={s.icon} s={18} c="#FE4081" />
            </div>
            <div>
              <div className="dn-stat__value">{s.value}</div>
              <div className="dn-stat__label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Allocation strip — mirrors frontend DonatePage */}
      <div className="dn-allocation dn-anim" style={{ animationDelay: "90ms" }}>
        <span className="dn-allocation__title">Where donations go</span>
        <div className="dn-allocation__items">
          {ALLOCATION.map(a => (
            <div key={a.label} className="dn-alloc-item">
              <div className="dn-alloc-item__top">
                <span className="dn-alloc-item__label">{a.label}</span>
                <span className="dn-alloc-item__pct">{a.pct}%</span>
              </div>
              <div className="dn-alloc-bar">
                <div className="dn-alloc-bar__fill" style={{ width: `${a.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Controls */}
      <div className="dn-controls dn-anim" style={{ animationDelay: "110ms" }}>
        <div className="dn-controls__left">
          <div className="dn-table-label">
            <Ic n="bar" s={15} c="rgba(255,255,255,0.4)" />
            <span className="dn-table-label__text">All Donations</span>
            <span className="dn-table-label__count">{filtered.length}</span>
          </div>
        </div>
        <div className="dn-controls__right">
          {/* Type filter */}
          <div className="dn-filter-wrap">
            <select className="dn-filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">All donors</option>
              <option value="member">Members only</option>
              <option value="anonymous">Anonymous only</option>
            </select>
          </div>
          {/* Sort */}
          <div className="dn-filter-wrap">
            <select className="dn-filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="date">Sort: Latest first</option>
              <option value="amount">Sort: Highest amount</option>
            </select>
          </div>
          {/* Search */}
          <div className="dn-search-wrap">
            <span className="dn-search-icon"><Ic n="search" s={13} c="rgba(255,255,255,0.35)" /></span>
            <input
              className="dn-search-input"
              placeholder="Search donor name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Table */}
      <div className="dn-table-wrap dn-anim" style={{ animationDelay: "140ms" }}>
        {loading ? (
          <div className="dn-empty">Loading donations...</div>
        ) : paged.length === 0 ? (
          <div className="dn-empty">No donations found{search ? ` matching "${search}"` : ""}.</div>
        ) : (
          <table className="dn-table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Amount</th>
                <th>Fund</th>
                <th>Type</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(d => {
                const isAnon  = d.type === "anonymous";
                const isLarge = d.amount >= 1000;
                return (
                  <tr key={d.id} onClick={() => setSelected(d)}>
                    {/* Donor */}
                    <td>
                      <div className="dn-donor">
                        <div
                          className={`dn-avatar${isAnon ? " dn-avatar--anon" : ""}`}
                          style={!isAnon ? { background: `${d.color}22`, color: d.color } : {}}
                        >
                          {isAnon
                            ? <Ic n="user" s={14} c="rgba(255,255,255,0.2)" />
                            : initials(d.name)
                          }
                        </div>
                        <div>
                          <div className="dn-donor__name">{d.name}</div>
                          {d.email && <div className="dn-donor__email">{d.email}</div>}
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td>
                      <span className={`dn-amount${isLarge ? " dn-amount--large" : ""}`}>
                        {fmtAmount(d.amount)}
                      </span>
                    </td>

                    {/* Fund */}
                    <td>
                      <span className="dn-fund-tag">
                        <Ic n="heart" s={10} c="#FE4081" />
                        {d.fund}
                      </span>
                    </td>

                    {/* Type */}
                    <td>
                      <span className="dn-type-pill" style={
                        isAnon
                          ? { background: "#1E1E1E", color: "rgba(255,255,255,0.4)", borderColor: "#3A3A3A" }
                          : { background: "rgba(196,18,98,0.08)", color: "#FE4081", borderColor: "rgba(196,18,98,0.25)" }
                      }>
                        <Ic n={isAnon ? "anon" : "user"} s={10} c="currentColor" />
                        {isAnon ? "Anonymous" : "Member"}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                      {d.date}
                    </td>

                    {/* Actions */}
                    <td onClick={e => e.stopPropagation()}>
                      <div className="dn-row-actions">
                        <button className="dn-icon-btn" onClick={() => setSelected(d)} title="View details">
                          <Ic n="eye" s={14} c="currentColor" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="dn-pagination">
            <span className="dn-pagination__info">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="dn-pagination__controls">
              <button className="dn-page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n}
                  className={`dn-page-num${n === page ? " dn-page-num--active" : ""}`}
                  onClick={() => setPage(n)}>
                  {n}
                </button>
              ))}
              <button className="dn-page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail drawer */}
      {selected && (
        <DonationDrawer donation={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}