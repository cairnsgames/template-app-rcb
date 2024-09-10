import Modal from "./components/modal";
import React, { useState } from "react";
import KlokoEvent from "./klokoevent";
import KlokoForm from "./klokoform";
import { useKloko } from "./usekloko";
import KlokoAdvert from "./klokoadvert";

const KlokoButton = () => {
  const [showForm, setShowForm] = useState(false);
  const { event } = useKloko();

  const close = () => setShowForm(false);

  if (!event) return null;

  return (
    <>
      <button
        className="kloko-button kloko-button-primary"
        onClick={() => setShowForm(true)}
      >
        Book Now
      </button>
      <Modal show={showForm} onClose={close}>
        <h1>Book</h1>
        <hr />
        <p>
          Complete the form below to make a booking for
          <strong style={{marginLeft: "0.5rem"}}>{event.title}</strong>
        </p>
        <KlokoForm onClose={close} />
        <KlokoAdvert />
      </Modal>
    </>
  );
};

export default KlokoButton;
