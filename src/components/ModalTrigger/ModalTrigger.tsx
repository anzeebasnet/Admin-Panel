"use client";

import React, { useState } from "react";
import Modal from "../Modal/Modal";

const ModalTrigger = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="lg:col-span-2 sm:col-span-2 ">
        <button
          onClick={openModal}
          className="sm:w-full w-32 sm:h-10 h-8 rounded-md bg-bg_orange sm:font-semibold font-medium sm:font-xl font-base text-white"
        >
          Open
        </button>
      </div>
      <div className="z-50">
        <Modal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </div>
  );
};

export default ModalTrigger;
