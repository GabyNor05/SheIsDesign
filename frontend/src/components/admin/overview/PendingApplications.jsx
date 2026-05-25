import {useState} from "react";
import {
  Check, X, IdentificationCard
} from "@phosphor-icons/react";
import { RxPeople } from "react-icons/rx";
import { T } from "../theme";
import SectionHeader from "../SectionHeader";
import Card from "./Card";

const PENDING_STUDENTS = [
  { id: 1, initials: "AD", name: "Amara Diailo",   uni: "Wits University",         field: "Graphic Design",       date: "2 May 2026",   color: "#FF2D78" },
  { id: 2, initials: "SM", name: "Siya Mokoena",   uni: "CPUT",                    field: "UX Design",            date: "1 May 2026",   color: "#60A5FA" },
  { id: 3, initials: "ND", name: "Naledi Dlamini", uni: "University of Pretoria",  field: "Illustration",         date: "30 Apr 2026",  color: "#22C55E" },
  { id: 4, initials: "TK", name: "Thandi Khumalo", uni: "University of Cape Town", field: "Visual Communication", date: "28 Apr 2026",  color: "#FBBF24" },
];

const PENDING_PROFESSIONALS = [
  { id: 5, initials: "LN", name: "Lerato Nkosi",    uni: "Ogilvy SA",         field: "Creative Director", date: "30 Apr 2026",  color: "#a78bfa" },
  { id: 6, initials: "ZP", name: "Zoe Petersen",    uni: "FCB Africa",        field: "Art Direction",     date: "29 Apr 2026",  color: "#34d399" },
  { id: 7, initials: "MB", name: "Mpho Baloyi",     uni: "Freelance",         field: "Brand Strategy",    date: "27 Apr 2026",  color: "#f97316" },
];

function ApplicantRow({ person, isLast }) {
  const [status, setStatus] = useState(null); // null | "approved" | "denied"

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0",
      borderBottom: isLast ? "none" : `1px solid ${T.border}`,
      opacity: status ? 0.55 : 1, transition: "opacity 0.3s",
    }}>
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: person.color + "22",
        border: `1.5px solid ${person.color}55`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 12, color: person.color,
      }}>
        {person.initials}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 600, color: T.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {person.name}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.textMuted }}>
          {person.uni} · {person.field}
        </div>
      </div>

      {/* Date */}
      <time style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.textMuted, flexShrink: 0, marginRight: 6 }}>
        {person.date}
      </time>

      {/* Actions */}
      {status === null ? (
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            onClick={() => setStatus("approved")}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: T.activeBg, border: `1px solid ${T.activeGreen}44`,
              borderRadius: 7, padding: "6px 12px", cursor: "pointer",
              color: T.activeGreen, fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, fontWeight: 600, transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = T.activeGreen + "22"}
            onMouseLeave={e => e.currentTarget.style.background = T.activeBg}
          >
            <Check size={12} color={T.activeGreen}/> 
            Approve
          </button>
          <button
            onClick={() => setStatus("denied")}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "none", border: `1px solid ${T.border}`,
              borderRadius: 7, padding: "6px 12px", cursor: "pointer",
              color: T.textSecond, fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, fontWeight: 500, transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.closedRed + "66"; e.currentTarget.style.color = T.closedRed; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecond; }}
          >
            <X size={12} color={T.closedRed}/>  Deny
          </button>
        </div>
      ) : (
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
          color: status === "approved" ? T.activeGreen : T.closedRed,
          background: status === "approved" ? T.activeBg : T.closedBg,
          borderRadius: 7, padding: "6px 12px",
        }}>
          {status === "approved" ? "✓ Approved" : "✗ Denied"}
        </span>
      )}
    </div>
  );
}

function PendingApplications() {
  const [tab, setTab] = useState("students");
  const total = PENDING_STUDENTS.length + PENDING_PROFESSIONALS.length;
  const list  = tab === "students" ? PENDING_STUDENTS : PENDING_PROFESSIONALS;

  return (
    <Card>
      <SectionHeader
        icon= {<RxPeople size = {16} />}
        title="Pending Applications"
        badge={total}
        action="View all"
      />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: `1px solid ${T.border}` }}>
        {[
          { key: "students",      label: "Students",             count: PENDING_STUDENTS.length },
          { key: "professionals", label: "Industry Professionals",count: PENDING_PROFESSIONALS.length },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "10px 16px 10px 0", marginRight: 20,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: tab === t.key ? 600 : 400,
            color: tab === t.key ? T.textPrimary : T.textSecond,
            borderBottom: `2px solid ${tab === t.key ? T.pink : "transparent"}`,
            transition: "all 0.15s", display: "flex", alignItems: "center", gap: 7,
          }}>
            {t.label}
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: tab === t.key ? T.pink : T.surfaceHi,
              color: tab === t.key ? "#fff" : T.textMuted,
              borderRadius: 20, padding: "1px 7px",
              transition: "all 0.15s",
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {list.map((person, i) => (
        <ApplicantRow key={person.id} person={person} isLast={i === list.length - 1} />
      ))}
    </Card>
  );
}

export default PendingApplications;