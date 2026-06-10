import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { T } from "../../components/admin/theme";
import Searchbar from "../../components/admin/event/Searchbar";
import Modal from "../../components/admin/Modal";
import EventForm from "../../components/admin/event/EventForm";
import LiveEvents from "../../components/admin/event/LiveEvents";
import AllEvents from "../../components/admin/event/AllEvents";

function ManageEvents() {
  const [modal, setModal] = useState(null);

  return (
    <div className="flex flex-col gap-8 px-20 w-full font-poppins">
      <div className="flex flex-row justify-between items-baseline">
        <div className="flex flex-col text-left">
          <h2 className="text-[40px] font-bold mb-1">Manage Events</h2>
          <p className="text-sm text-[#A0A0A0]">
            Create, manage and monitor all SheIsDesign events.
          </p>
        </div>
        <div className="flex flex-row justify-left items-end gap-2">
          <Searchbar />
          <button
            onClick={() => setModal("create")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: T.pink,
              border: "none",
              borderRadius: 9,
              padding: "10px 20px",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: 13.5,
              transition: "opacity .15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = ".85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <Plus size={14} color="#fff" /> Create Event
          </button>
        </div>
      </div>

      <LiveEvents />
      <AllEvents />

      {modal === "create" && (
        <Modal onClose={() => setModal(null)} title="Create New Event" wide>
          <EventForm onSave={() => setModal(null)} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

export default ManageEvents;
