
import {useState } from "react";
import { Plus, IdentificationCard, Handshake} from "@phosphor-icons/react";
import {FiBarChart2} from "react-icons/fi";
import EventForm from "../event/EventForm";
import InviteJudgeForm from "../event/InviteJudgeForm";
import Modal from "../Modal";



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
  { id: 1, icon: <Plus size={16}/>, label: "Create Event" },
  { id: 2, icon: <Handshake size={16}/>, label: "Invite Judge"},
  { id: 3, icon: <FiBarChart2 size={16}/>, label: "View Leaderboard"},
];

function QuickActions({ setActiveTab }) {
  const [modal, setModal] = useState(null);

  const handleCreate = (eventData) => {
    console.log("Creating event:", eventData);
    // TODO: API call to create event
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
        setModal("create");
        break;
      case 2:
        setModal("invite");
        break;
      case 3:
        setActiveTab("Leaderboard");
        break;
      default:
        break;
    }
  };
     return(
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
      {QUICK_ACTIONS.map((action, i) => (
        <button key={action.id} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: i === 0 ? T.pink : T.surface,
          border: `1px solid ${i === 0 ? T.pink : T.border}`,
          borderRadius: "16777200px", padding: "10px 18px", cursor: "pointer",
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

      {modal === "create" && (
        <Modal onClose={() => setModal(null)} title="Create New Event" wide>
          <EventForm onSave={handleCreate} onClose={() => setModal(null)} />
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