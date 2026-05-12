{/* ── Modals */}
      {modal === "create" && (
        <Modal title="Create New Event" onClose={() => setModal(null)} wide>
          <EventForm onSave={handleCreate} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal === "edit" && active && (
        <Modal title="Edit Event" onClose={() => { setModal(null); setActive(null); }} wide>
          <EventForm initial={active} onSave={handleEdit} onClose={() => { setModal(null); setActive(null); }} />
        </Modal>
      )}
      {modal === "delete" && active && (
        <ConfirmDelete event={active} onConfirm={handleDelete} onClose={() => { setModal(null); setActive(null); }} />
      )}