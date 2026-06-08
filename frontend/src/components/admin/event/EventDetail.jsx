import { T } from "../theme";
import Badge from "./Badge";
import EventImage from "./EventImage";
import MetaRow from "./MetaRow";
import ProgressBar from "./ProgressBar";
import Icon from "./Icon";
import { fmtDate } from "./utils";

export default function EventDetail({ event, onBack, onEdit }) {
  function calcPct(count, max) { return max > 0 ? Math.min(100, Math.round((count / max) * 100)) : 0; }
  const p = calcPct(event.entry_count, event.max_entries);
  const stats = [
    { label:"Participants", value:event.entry_count,      icon:"users" },
    { label:"Submissions",  value:event.submissions || 0, icon:"file"  },
    { label:"Points",       value:event.points_reward,    icon:"award" },
    { label:"Max Entries",  value:event.max_entries,      icon:"users" },
  ];
  const infoRows = [
    { label:"Start Date", val:fmtDate(event.start_date)  },
    { label:"Deadline",   val:fmtDate(event.end_date)    },
    { label:"Location",   val:event.location || "Online" },
    { label:"Time",       val:event.time || "—"          },
  ];

  return (
    <div className="ev-detail">
      <button className="ev-detail__back-btn" onClick={onBack}>Back to Events</button>
      <div className="ev-detail__banner" style={{
        height: 200,
        background: event.image_link
          ? `url(${event.image_link}) center/cover`
          : `linear-gradient(135deg, ${T.pinkDim}, #1a1a1a)`,
      }}>
        <div className="ev-detail__banner-overlay">
          <div className="ev-detail__banner-tags">
            <Badge status={event.status} />
            <span className="ev-detail__banner-cat">{event.categoryLabel || event.category}</span>
          </div>
          <h1 className="ev-detail__banner-title">{event.title}</h1>
        </div>
      </div>
      <div className="ev-detail__id-row">
        <code className="ev-detail__id">{event.EventID}</code>
        <button className="btn-primary" onClick={onEdit}>
          <Icon n="edit" s={13} c="#fff" /> Edit Event
        </button>
      </div>
      <div className="ev-detail__stats">
        {stats.map(st => (
          <div key={st.label} className="ev-detail__stat-card">
            <Icon n={st.icon} s={15} c={T.pinkHot} />
            <div className="ev-detail__stat-value">{st.value}</div>
            <div className="ev-detail__stat-label">{st.label}</div>
          </div>
        ))}
      </div>
      <div className="ev-detail__progress-card">
        <div className="ev-detail__progress-header">
          <span className="ev-detail__progress-title">Registration Progress</span>
          <span className="ev-detail__progress-pct">{p}%</span>
        </div>
        <div className="progress-track" style={{ height:7 }}>
          <div className="progress-fill" style={{ width:`${p}%` }} />
        </div>
        <div className="ev-detail__progress-foot">
          <span>{event.entry_count} registered</span>
          <span>{event.max_entries} max</span>
        </div>
      </div>
      <div className="ev-detail__info-grid">
        {infoRows.map(it => (
          <div key={it.label} className="ev-detail__info-card">
            <div className="ev-detail__info-label">{it.label}</div>
            <div className="ev-detail__info-value">{it.val}</div>
          </div>
        ))}
      </div>
      <div className="ev-detail__desc-card">
        <div className="ev-detail__desc-title">Description</div>
        <p className="ev-detail__desc-text">{event.description || "No description provided."}</p>
      </div>
    </div>
  );
}