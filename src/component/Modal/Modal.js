import React, { useEffect, useRef, useState } from "react";
import "./Modal.scss";

const Modal = ({ active, action, children, size = 'lg', title }) => {
  const componentRef = useRef(null);
  const modalRef = useRef(null);
  const BGRef = useRef(null);

  useEffect(() => {
    if (active) {
      setTimeout(() => {
        modalRef.current.classList.add("modal-container-active");
      }, 200);
      BGRef.current.classList.add("bg-blur-active");
      componentRef.current.classList.add("modal-event-active");
    } else {
      onClose();
    }

    return () => clearInterval(modalRef.current);
  });

  const onClose = () => {
    modalRef.current.classList.remove("modal-container-active");
    BGRef.current.classList.remove("bg-blur-active");
    componentRef.current.classList.remove("modal-event-active");
    if (action) {
      var newAction = {
        status: "close",
        isActive: false,
        data: {},
      };
      action(newAction);
    }
  };

  return (
    <div className="Modal" ref={componentRef}>
      {/* {active ? <div className="bg-blur"></div> : <></>} */}

      <div className="bg-blur" ref={BGRef}></div>
      <div
        className={`modal-container ` + size}
        ref={modalRef}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <div className="close" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </div>
        </div>
        <div className="modal-main">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
