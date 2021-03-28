import React from 'react';
import './Card.css';

export const Card = ({
  title,
  imageUrl,
  body
}) => {
  return (
    <div className="card-container">
        <div className="image-container">
          <img src={imageUrl} alt=""></img>
        </div>
        <div className="card-title">
            {title}
        </div>
        <div className="card-body">
            {body}
        </div>
    </div>
  );
};
