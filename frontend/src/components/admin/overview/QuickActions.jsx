import { useState } from "react";
import { Fire } from "@phosphor-icons/react";
import Section from "./Section";

const T = {
  // Backgrounds
  bg:        "#0D0D0D",   // page background
  surface:   "#1A1A1A",   // card / sidebar background
  surfaceHi: "#242424",   // elevated card, hover surface
  border:    "#2E2E2E",   // subtle dividers
  // Brand
  pink:      "#FF2D78",   // primary CTA / active state
  pinkDim:   "#3D0F22",   // pink tint background (accessible)
  // Text — all WCAG AA on #1A1A1A
  textPrimary:  "#F0F0F0",  // 15.3:1 on surface
  textSecond:   "#A0A0A0",  // 5.9:1 on surface — AA large
  textMuted:    "#6B6B6B",  // decorative only
  // Status
  activeGreen:  "#22C55E",
  activeBg:     "#052512",
  upBlue:       "#60A5FA",
  upBg:         "#0A1628",
  draftGray:    "#A0A0A0",
  draftBg:      "#222222",
  closedRed:    "#F87171",
  closedBg:     "#200B0B",
};

const QUICK_ACTIONS = [
  { id: 1, title: "Create New Event",      desc: "Set up a design challenge, workshop, or competition.", tag: "Open →" },
  { id: 2, title: "Review Submissions",    desc: "Browse and evaluate participant design submissions.",  tag: "Open →" },
  { id: 3, title: "View Leaderboard",      desc: "See top-ranked participants across active events.",    tag: "Open →" },
  { id: 4, title: "Add Sponsor/Donation",  desc: "Log a new sponsorship or donation entry.",             tag: "Open →" },
];

function QuickActionCard({ action }) {
  const [hov, setHov] = useState(false);
  return (
    <button 
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onFocus={e => { setHov(true); e.currentTarget.style.boxShadow = `0 0 0 2px ${T.pink}`; }}
      onBlur={e  => { setHov(false); e.currentTarget.style.boxShadow = "none"; }}
      style={{
        flex: "1 1 180px", textAlign: "left", cursor: "pointer",
        background: hov ? T.pink : T.surfaceHi,
        border: `1px solid ${hov ? T.pink : T.border}`,
        borderRadius: 12, padding: "18px 18px 14px",
        transition: "all 0.18s", outline: "none",
      }}
    >
      <div  className="font-syne font-bold text-lg text-white mb-2" style={{
        color: hov ? "#fff" : T.textPrimary,
      }}>
        {action.title}
      </div>
      <div  className="font-dm-sans text-sm text-gray-300 mb-3" style={{
        color: hov ? "rgba(255,255,255,0.8)" : T.textSecond,
        lineHeight: 1.55,
      }}>
        {action.desc}
      </div>
      <span  className="font-dm-sans text-xs font-semibold tracking-wide" style={{
        color: hov ? "#fff" : T.pink,
      }}>
        {action.tag}
      </span>
    </button>
  );
}


function QuickActions() {
    return (
        <Section icon={<Fire size={24} />} title="Quick Actions">
            <div style={{ display: "flex", gap: 14, paddingTop: 16, flexWrap: "wrap" }}>
            {QUICK_ACTIONS.map(a => <QuickActionCard key={a.id} action={a} />)}
            </div>
        </Section>
    );
}


export default QuickActions;