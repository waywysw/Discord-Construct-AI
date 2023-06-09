import { useEffect } from "react";
import "./modalStyles.css";

function Modal({ children, isOpen, handleClose }) {
  useEffect(() => {
    
    const closeOnEscapeKey = e => e.key === "Escape" ? handleClose() : null;
    const closeOnOutsideClick = e => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.body.addEventListener("keydown", closeOnEscapeKey);
    window.addEventListener("mousedown", closeOnOutsideClick);
  
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
      window.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);  

  if (!isOpen) return null;

  return (
    <div className="modal">
      <button onClick={handleClose} className="close-btn">
        Close
      </button>
      <div className="modal-content">{children}</div>
    </div>
  );
};

export default Modal;