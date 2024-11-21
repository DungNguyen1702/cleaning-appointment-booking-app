import React, { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";

const ImageUploader = ({ imageSrc, onImageChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isValidImageSrc, setIsValidImageSrc] = useState(true);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(file); // Trả về file thay vì DataURL
    }
  };

  useEffect(() => {
    console.log("imageSrc changed:", imageSrc); // Kiểm tra xem imageSrc có thay đổi hay không

    if (!imageSrc || imageSrc.trim() === "") {
      setIsValidImageSrc(false);
      return;
    }

    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg"];
    const extension = imageSrc
      .substring(imageSrc.lastIndexOf("."))
      .toLowerCase();
    const isValidExtension = validExtensions.includes(extension);

    const img = new Image();
    img.onload = () => {
      setIsValidImageSrc(true);
    };
    img.onerror = () => {
      setIsValidImageSrc(false);
    };
    img.src = imageSrc;

    setIsValidImageSrc(isValidExtension);
  }, [imageSrc]);

  return (
    <div
      className="image-uploader"
      style={{
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isValidImageSrc ? (
        <img
          src={imageSrc}
          alt="thumbnails"
          style={{
            filter: isHovered ? "blur(1px)" : "none",
            transition: "filter 0.3s ease",
          }}
        />
      ) : (
        <label
          htmlFor={`upload-input-${imageSrc}`}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
            minHeight: "100px",
            minWidth: "110px",
            maxHeight: "100px",
            objectFit: "cover",
            maxWidth: "110px",
            border: "solid 1px #ccc",
            cursor: "pointer",
          }}
        >
          <FaUpload size={30} color="#e8807f" />
        </label>
      )}
      {isHovered && isValidImageSrc && (
        <label
          htmlFor={`upload-input-${imageSrc}`}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
          }}
        >
          <FaUpload size={30} color="#e8807f" />
        </label>
      )}
      <input
        id={`upload-input-${imageSrc}`}
        type="file"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImageUploader;
