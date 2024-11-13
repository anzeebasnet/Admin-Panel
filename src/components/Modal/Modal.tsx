import React from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import AddBusiness from "../Forms/AddBusinessForm";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  heading: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, heading }) => {
  if (!isOpen) {
    return null;
  }

  // Function to handle click outside modal content
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); // Close modal if clicked outside the content
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-40"
      onClick={handleBackgroundClick}
    >
      <div className="dark:bg-card_dark bg-white sm:p-8 p-4 rounded shadow-lg lg:w-[30vw] sm:w-[50vw] w-[96vw] ">
        <AddBusiness onClose={onClose} heading={heading} />
      </div>
    </div>
  );
};

export default Modal;
