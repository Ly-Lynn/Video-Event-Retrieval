import React from 'react';

function ImageCard({ image }) {
  return (
    <div className="image-card">
      <img src={image.src} alt={image.description} />
      <p>{image.description}</p>
    </div>
  );
}

export default ImageCard;
