import { useState, useEffect } from "react";
import { Check, X } from "@phosphor-icons/react";
import { RxPeople } from "react-icons/rx";
import { T } from "../theme";
import {
  fetchParticipantsForAdmin,
  updateParticipantStatus,
} from "../../../services/participantService";
import SectionHeader from "../SectionHeader";
import Card from "./Card";

const PENDING_STUDENTS = [
  {
    id: 1,
    type: "student",
    status: "pending",
    initials: "AD",
    name: "Amara Diailo",
    uni: "Wits University",
    field: "Graphic Design",
    date: "2 May 2026",
    color: "#FF2D78",
  },
  {
    id: 2,
    type: "student",
    status: "pending",
    initials: "SM",
    name: "Siya Mokoena",
    uni: "CPUT",
    field: "UX Design",
    date: "1 May 2026",
    color: "#60A5FA",
  },
  {
    id: 3,
    type: "student",
    status: "pending",
    initials: "ND",
    name: "Naledi Dlamini",
    uni: "University of Pretoria",
    field: "Illustration",
    date: "30 Apr 2026",
    color: "#22C55E",
  },
  {
    id: 4,
    type: "student",
    status: "pending",
    initials: "TK",
    name: "Thandi Khumalo",
    uni: "University of Cape Town",
    field: "Visual Communication",
    date: "28 Apr 2026",
    color: "#FBBF24",
  },
];

const PENDING_PROFESSIONALS = [
  {
    id: 5,
    type: "professional",
    status: "pending",
    initials: "LN",
    name: "Lerato Nkosi",
    uni: "Ogilvy SA",
    field: "Creative Director",
    date: "30 Apr 2026",
    color: "#a78bfa",
  },
  {
    id: 6,
    type: "professional",
    status: "pending",
    initials: "ZP",
    name: "Zoe Petersen",
    uni: "FCB Africa",
    field: "Art Direction",
    date: "29 Apr 2026",
    color: "#34d399",
  },
  {
    id: 7,
    type: "professional",
    status: "pending",
    initials: "MB",
    name: "Mpho Baloyi",
    uni: "Freelance",
    field: "Brand Strategy",
    date: "27 Apr 2026",
    color: "#f97316",
  },
];

const STATUS_COLORS = {
  approved: "#22C55E",
  pending: "#FBBF24",
  rejected: "#F87171",
};

function getInitials(name = "", email = "") {
  const source = (name || email || "").trim();
  if (!source) return "?";

  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function normalizeApplicant(item) {
  const status = (item.status || "pending").toLowerCase();
  const type = (item.type || "student").toLowerCase();

  return {
    id: item.id,
    type,
    status,
    initials: item.initials || getInitials(item.name, item.email),
    name: item.name || item.fullName || "Unknown participant",
    uni:
      item.institution || item.university || item.uni || "Unknown institution",
    field: item.field || item.jobTitle || "General",
    date: item.joined || item.dateCreated || item.date || "—",
    email: item.email || "",
    color: item.color || STATUS_COLORS[status] || "#FE4081",
  };
}

function getPendingApplicants(items) {
  const source =
    Array.isArray(items) && items.length > 0
      ? items
      : [...PENDING_STUDENTS, ...PENDING_PROFESSIONALS];

  return source
    .map(normalizeApplicant)
    .filter(
      (person) => (person.status || "pending").toLowerCase() === "pending",
    );
}

function ApplicantRow({ person, isLast, onApprove, onReject }) {
  const [status, setStatus] = useState(null); // null | "approved" | "denied"

  const handleApprove = async () => {
    setStatus("approved");
    try {
      await onApprove(person.id);
    } catch (error) {
      setStatus(null);
    }
  };

  const handleReject = async () => {
    setStatus("denied");
    try {
      await onReject(person.id);
    } catch (error) {
      setStatus(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 0",
        borderBottom: isLast ? "none" : `1px solid ${T.border}`,
        opacity: status ? 0.55 : 1,
        transition: "opacity 0.3s",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          flexShrink: 0,
          background: person.color + "22",
          border: `1.5px solid ${person.color}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 800,
          fontSize: 12,
          color: person.color,
        }}
      >
        {person.initials}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 13.5,
            fontWeight: 600,
            color: T.textPrimary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {person.name}
        </div>
        <div
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 11.5,
            color: T.textMuted,
          }}
        >
          {person.uni} · {person.field}
        </div>
      </div>

      {/* Date */}
      <time
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 11.5,
          color: T.textMuted,
          flexShrink: 0,
          marginRight: 6,
        }}
      >
        {person.date}
      </time>

      {/* Actions */}
      {status === null ? (
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            onClick={handleApprove}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: T.activeBg,
              border: `1px solid ${T.activeGreen}44`,
              borderRadius: 7,
              padding: "6px 12px",
              cursor: "pointer",
              color: T.activeGreen,
              fontFamily: "'Poppins', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = T.activeGreen + "22")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = T.activeBg)
            }
          >
            <Check size={12} color={T.activeGreen} />
            Approve
          </button>
          <button
            onClick={handleReject}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "none",
              border: `1px solid ${T.border}`,
              borderRadius: 7,
              padding: "6px 12px",
              cursor: "pointer",
              color: T.textSecond,
              fontFamily: "'Poppins', sans-serif",
              fontSize: 12,
              fontWeight: 500,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.closedRed + "66";
              e.currentTarget.style.color = T.closedRed;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.color = T.textSecond;
            }}
          >
            <X size={12} color={T.closedRed} /> Deny
          </button>
        </div>
      ) : (
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: status === "approved" ? T.activeGreen : T.closedRed,
            background: status === "approved" ? T.activeBg : T.closedBg,
            borderRadius: 7,
            padding: "6px 12px",
          }}
        >
          {status === "approved" ? "✓ Approved" : "✗ Denied"}
        </span>
      )}
    </div>
  );
}

function PendingApplications() {
  const [tab, setTab] = useState("students");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const data = await fetchParticipantsForAdmin();
      setParticipants(getPendingApplicants(data));
      setError(null);
    } catch (err) {
      console.error("Error fetching participants:", err);
      setParticipants(getPendingApplicants([]));
      setError(err.message || "Failed to load pending applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  const studentApplicants = participants.filter(
    (person) => person.type === "student",
  );
  const professionalApplicants = participants.filter(
    (person) => person.type === "professional",
  );
  const list = tab === "students" ? studentApplicants : professionalApplicants;

  const handleApprove = async (id) => {
    try {
      await updateParticipantStatus(id, "approved");
      setParticipants((prev) => prev.filter((person) => person.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const handleReject = async (id) => {
    try {
      await updateParticipantStatus(id, "rejected");
      setParticipants((prev) => prev.filter((person) => person.id !== id));
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <Card style={{ width: "100%" }}>
        <SectionHeader
          icon={<RxPeople size={16} />}
          title="Pending Applications"
          badge="Loading..."
        />
        <div
          style={{ padding: "20px", textAlign: "center", color: T.textMuted }}
        >
          Loading applications...
        </div>
      </Card>
    );
  }

if (error) {
    return (
      <Card className="w-full">
        <SectionHeader
          icon={<RxPeople size={16} />}
          title="Pending Applications"
          badge={participants.length}
        />
        <div style={{ padding: "20px", textAlign: "center" }}>
          <span style={{ color: T.closedRed, fontSize: 13, fontFamily: "'Poppins', sans-serif" }}>
            ⚠ Unable to load applications
          </span>
          <p style={{ color: T.textMuted, fontSize: 12, marginTop: 6, fontFamily: "'Poppins', sans-serif" }}>
            Check your backend connection and try again.
          </p>
          <button
            onClick={loadParticipants}
            style={{
              marginTop: 12,
              background: "none",
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: "6px 16px",
              color: T.textSecond,
              fontFamily: "'Poppins', sans-serif",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ width: "100%" }}>
      <SectionHeader
        icon={<RxPeople size={16} />}
        title="Pending Applications"
        badge={participants.length}
        action="View all"
      />

      <div
        style={{
          width: "422.39px",
          display: "flex",
          gap: 0,
          marginBottom: 16,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        {[
          {
            key: "students",
            label: "Students",
            count: studentApplicants.length,
          },
          {
            key: "professionals",
            label: "Industry Professionals",
            count: professionalApplicants.length,
          },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "10px 16px 10px 0",
              marginRight: 20,
              fontFamily: "'Poppins', sans-serif",
              fontSize: 13.5,
              fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? T.textPrimary : T.textSecond,
              borderBottom: `2px solid ${tab === t.key ? T.pink : "transparent"}`,
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            {t.label}
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: tab === t.key ? T.pink : T.surfaceHi,
                color: tab === t.key ? "#fff" : T.textMuted,
                borderRadius: 20,
                padding: "1px 7px",
                transition: "all 0.15s",
              }}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div style={{ padding: "12px 0", color: T.textMuted }}>
          No pending applications found.
        </div>
      ) : (
        list.map((person, i) => (
          <ApplicantRow
            key={person.id}
            person={person}
            isLast={i === list.length - 1}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))
      )}
    </Card>
  );
}

export default PendingApplications;
