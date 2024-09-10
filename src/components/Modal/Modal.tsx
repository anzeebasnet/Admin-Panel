import React from "react";
import { RiCloseCircleFill } from "react-icons/ri";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
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
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
    onClick={handleBackgroundClick}
    >
      <div className="bg-white sm:p-8 p-4 rounded shadow-lg lg:w-[30vw] sm:w-[50vw] w-[96vw] h-[50vh]">
      <div className="flex justify-between">
          <h1 className="text-bg_orange dark:text-white sm:text-xl text-lg font-normal">Live Feed</h1>
          <button
              className="col-span-1 justify-self-end text-gray-400 hover:text-gray-800"
              onClick={onClose}
            >
              <RiCloseCircleFill size={25} color="black" />
            </button>
      </div>
      </div>
    </div>
  );
};

export default Modal;
