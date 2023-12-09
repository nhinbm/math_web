import React from "react";

const Dropdown = ({ show, setImage, setAudio }) => {
  const handleAudio = () => {
    setAudio(true);
  };

  const handleImage = () => {
    setImage.current.click();
  };

  return (
    <>
      {show && (
        <div className="dropdown-wrapper">
          <div onClick={handleImage}>File Ảnh</div>
          <hr />
          <div onClick={handleAudio}>File Âm Thanh</div>
        </div>
      )}
    </>
  );
};

export default Dropdown;
