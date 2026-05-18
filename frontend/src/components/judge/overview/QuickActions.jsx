
import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { Plus, ClipboardText, Handshake, Eye } from "@phosphor-icons/react";
import { FiBarChart2 } from "react-icons/fi";
import EventForm from "../../admin/event/EventForm";
import InviteJudgeForm from "../../admin/event/InviteJudgeForm";
import Modal from "../../admin/Modal";
import { T } from "../../admin/theme";


const QUICK_ACTIONS = [
  { id: 1, icon: <ClipboardText size={16} />, label: "Judge an Event" },
  { id: 2, icon: <Eye size={16} />, label: "View Student Work" },
  { id: 3, icon: <FiBarChart2 size={16} />, label: "View Leaderboard" },
];

function QuickActions({ setActiveTab }) {
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();

  const handleJudgeEvent = (availableEvents) => {
    console.log("Judging event:", availableEvents);
    // TODO: API call to judge event
    setModal(null);
  };

  const handleInvite = (inviteData) => {
    console.log("Inviting judge:", inviteData);
    // TODO: API call to invite judge
    setModal(null);
  };

  const buttonAction = (id) => {
    switch (id) {
      case 1:
        setModal("apply");
        break;
      case 2:
        navigate("/gallery");
        break;
      case 3:
        setActiveTab("Leaderboard");
        break;
      default:
        break;
    }
  };
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap",  }}>
      {QUICK_ACTIONS.map((action, i) => (
        <button key={action.id} style={{
          display: "flex", alignItems: "center", gap: 6,
          background: i === 0 ? T.pink : T.surface,
          border: `1px solid ${i === 0 ? T.pink : T.border}`,
          borderRadius: "16777200px", padding: "8px 16px", cursor: "pointer",
          color: i === 0 ? "#fff" : T.textSecond,
          fontFamily: "Poppins", fontSize: 13.5, fontWeight: 500,
          transition: "all 0.18s",
        }}
          onMouseEnter={e => {
            if (i !== 0) { e.currentTarget.style.background = T.surfaceHi; e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.textPrimary; }
            else { e.currentTarget.style.opacity = "0.85"; }
          }}
          onMouseLeave={e => {
            if (i !== 0) { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecond; }
            else { e.currentTarget.style.opacity = "1"; }
          }}
          onClick={() => buttonAction(action.id)}
        >
          <div>{action.icon}</div>
          {action.label}
        </button>
      ))}

      {modal === "apply" && (
        <Modal onClose={() => setModal(null)} title="Apply to Judge Event" wide>
          <EventForm onSave={handleJudgeEvent} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal === "invite" && (
        <Modal onClose={() => setModal(null)} title="Invite Judge" wide>
          <InviteJudgeForm onSave={handleInvite} onClose={() => setModal(null)} />
        </Modal>
      )}

    </div>

  );


}


export default QuickActions;