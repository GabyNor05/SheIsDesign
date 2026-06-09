
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventForm from "../event/EventForm";
import InviteJudgeForm from "../event/InviteJudgeForm";
import Modal from "../Modal";
import { Icon } from "./Icon";
import "../../../pages/admin/template/AdminDashboardV2.css";


const QUICK_ACTIONS = [
  { id: 1, icon: "plus", label: "Create Event" },
  { id: 2, icon: "award", label: "Invite Judge" },
  { id: 3, icon: "chart", label: "View Leaderboard" },
];

function QuickActions() {
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();

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
        navigate("/admin/leaderboard");
        break;
      default:
        break;
    }
  };
  return (
    
    <div className="quick-actions">
      {QUICK_ACTIONS.map((action, i) => (
        <button 
          key={action.id}
          className={`quick-actions__btn${i === 0 ? " quick-actions__btn--primary" : ""}`}
          onClick={() => buttonAction(action.id)}
        >
          <Icon name={action.icon} size={15} color={i === 0 ? "#fff" : "var(--text-second)"} />
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