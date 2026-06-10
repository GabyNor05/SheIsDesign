import { useState } from "react";
import { T, STATUS_STYLES } from "../theme";
import {
  Calendar,
  Clock,
  MapPin,
  Gear,
  Users,
  Trash,
  CalendarX,
  Image,
} from "@phosphor-icons/react";

const JudgeCount = 0;

function ProgressBar({ count, max }) {
  const p = max > 0 ? Math.min(100, Math.round((count / max) * 100)) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          height: 4,
          background: T.surfaceHi,
          borderRadius: 3,
          overflow: "hidden",
          flex: 1,
        }}
      >
        <div
          style={{
            width: `${p}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${T.pink}88, ${T.pink})`,
            borderRadius: 3,
            transition: "width .5s",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 11,
          color: T.textMuted,
          minWidth: 45,
        }}
      >
        {count} / {max}
      </span>
    </div>
  );
}

const displayJudgeCount = (JudgeCount) => {
  if (JudgeCount === 0){
    return "";
  } else if (JudgeCount === 1){
    return JudgeCount + "Judge";
  }else {
    return JudgeCount + "Judges";
  }
}


function CompactCard({ event, onView, onManage, onDelete, onClose }) {
  const [hov, setHov] = useState(false);
  const s = STATUS_STYLES[event.status] || STATUS_STYLES.DRAFT;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        overflow: "hidden",
        transition: "all 0.2s",
        boxShadow: hov ? `0 12px 32px rgba(0,0,0,0.1)` : "none",
      }}
    >
      {/* Top Status Bar */}
      <div
        style={{
          height: 4,
          background: s.bg || T.pink,
        }}
      />

      {/* Image Placeholder */}
      <div
        style={{
          height: 140,
          background: T.surfaceHi,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {event.image_link === "" ? (
          <img
            src={event.image_link}
            alt="Event"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Image size={32} color={T.textMuted} />
        )}
      </div>

      {/* Content Section */}
      <div style={{ padding: 16 }}>
        {/* Title & Category */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: "Poppins, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: T.textPrimary,
              maxWidth: "70%",
            }}
          >
            {event.title}
          </h3>
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 11,
              color: T.textMuted,
              background: T.surfaceHi,
              padding: "4px 8px",
              borderRadius: 4,
            }}
          >
            {event.category}
          </span>
        </div>

        {/* Meta Info Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 12,
            fontSize: 12,
            color: T.textSecond,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar size={14} color={T.textMuted} />
            <span style={{ fontFamily: "'Poppins', sans-serif" }}>
              {event.start_date || "TBD"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={14} color={T.textMuted} />
            <span style={{ fontFamily: "'Poppins', sans-serif" }}>
              {event.time || "00:00"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={14} color={T.textMuted} />
            <span style={{ fontFamily: "'Poppins', sans-serif" }}>
              {event.location || "123 Main Str"}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: 12 }}>
          <ProgressBar count={event.entry_count} max={event.max_entries} />
        </div>

            {/* Points & Judges */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="w-fit py-1 px-3 rounded-full"
                style={{
                  background: T.textMuted ,
                  fontFamily: "Poppins, sans-serif",
                  color: T.textPrimary,
                  fontSize: 12,
                }}
              >
                {event.points_reward} pts
              </span>
              <div className="text-xs  flex items-center gap-1"
              style={{ display: "flex", alignItems: "center", gap: 6, color: T.textSecond}}>
                <Users size={14}  />
                {displayJudgeCount(JudgeCount)}
              </div>
            </div>
        {/* Bottom Info & Actions */}
        <div className="flex flex-row"
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 12,
            borderTop: `1px solid ${T.border}`,
          }}
        >

          {/* Action Buttons */}
          
            <div>
              {/* Close Event Button */}
      {event.status !== "CLOSED" && (
        <div
          
        >
          <button
            onClick={onClose}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "none",
              border: `1px solid ${T.border}`,
              borderRadius: 6,
              padding: "5px",
              cursor: "pointer",
              color: T.textSecond,
              transition: "all 0.15s",
              fontFamily: "'Poppins', sans-serif",
              fontSize: 13,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = T.activeGreen + "20";
              e.currentTarget.style.color = T.activeGreen;
              e.currentTarget.style.borderColor = T.activeGreen;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = T.textSecond;
              e.currentTarget.style.borderColor = T.border;
            }}
            title="Close Event"
          >
            <CalendarX size={16} color="currentColor" />
            Close Event
          </button>
        </div>
      )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={onManage}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: T.surfaceHi,
                  border: `1px solid ${T.border}`,
                  borderRadius: 6,
                  padding: "6px 8px",
                  cursor: "pointer",
                  color: T.textSecond,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.upBlue + "20";
                  e.currentTarget.style.color = T.upBlue;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = T.surfaceHi;
                  e.currentTarget.style.color = T.textSecond;
                }}
                title="Edit Event"
              >
                <Gear size={14} color="currentColor" />
              </button>

              <button
                onClick={onView}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: T.surfaceHi,
                  border: `1px solid ${T.border}`,
                  borderRadius: 6,
                  padding: "6px 8px",
                  cursor: "pointer",
                  color: T.textSecond,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.pink + "20";
                  e.currentTarget.style.color = T.pink;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = T.surfaceHi;
                  e.currentTarget.style.color = T.textSecond;
                }}
                title="View Details"
              >
                <Users size={14} color="currentColor" />
              </button>

              <button
                onClick={onDelete}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: T.surfaceHi,
                  border: `1px solid ${T.border}`,
                  borderRadius: 6,
                  padding: "6px 8px",
                  cursor: "pointer",
                  color: T.textSecond,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.closedRed + "20";
                  e.currentTarget.style.color = T.closedRed;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = T.surfaceHi;
                  e.currentTarget.style.color = T.textSecond;
                }}
                title="Delete Event"
              >
                <Trash size={14} color="currentColor" />
              </button>
            </div>
          </div>
       
      </div>

      
    </div>
  );
}

export default CompactCard;
