import React, { useRef, useState } from "react";
import "./styles.css";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const centerAspectCrop = (mediaWidth, mediaHeight, aspect) => {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
};

const Modal = ({ open, onClose, image }) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState();
  const aspect = undefined;

  const handleClose = () => {
    onClose(false);
  };

  const onImageLoad = () => {
    const { width, height } = imgRef.current;
    setCrop(centerAspectCrop(width, height, 16 / 9));
  };

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const crop = completedCrop;
    const canvas = previewCanvasRef.current;
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX * pixelRatio;
    canvas.height = crop.height * scaleY * pixelRatio;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    console.log(
      image.width,
      image.height,
      crop.x,
      crop.y,
      crop.width,
      crop.height
    );
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    const dataURL = canvas.toDataURL();
    console.log(dataURL);
    await fetch("https://127.0.0.1/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: dataURL,
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {});

    onClose(false);
  }

  if (!open) return null;
  return (
    <div onClick={handleClose} className="modal-overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modal-container"
      >
        <div className="modal-header">
          <div>Cut with one question</div>
          <div onClick={handleClose}>X</div>
        </div>
        {image && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => {
              setCrop(percentCrop);
            }}
            onComplete={(c) => {
              setCompletedCrop(c);
            }}
            aspect={aspect}
            minWidth={400}
            minHeight={100}
          >
            <img
              ref={imgRef}
              src={image}
              alt="Crop"
              className="modal-image"
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}
        <canvas
          ref={previewCanvasRef}
          style={{ display: "none", width: "100%", height: "100%" }}
        />
        <button className="modal-button-cut" onClick={onDownloadCropClick}>
          Cắt ảnh
        </button>
      </div>
    </div>
  );
};

export default Modal;
