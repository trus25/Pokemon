import React from 'react';
import './Card.css';

// const colours = [
// 	'normal',
// 	'fire',
// 	'water',
// 	'electric',
// 	'grass',
// 	'ice',
// 	'fighting',
// 	'poison',
// 	'ground',
// 	'flying',
// 	'psychic',
// 	'bug',
// 	'rock',
// 	'ghost',
// 	'dragon',
// 	'dark',
// 	'steel',
// 	'fairy',
// ];

const colours={
  normal: '#A8A77A',
	fire: '#EE8130',
	water: '#6390F0',
	electric: '#F7D02C',
	grass: '#7AC74C',
	ice: '#96D9D6',
	fighting: '#C22E28',
	poison: '#A33EA1',
	ground: '#E2BF65',
	flying: '#A98FF3',
	psychic: '#F95587',
	bug: '#A6B91A',
	rock: '#B6A136',
	ghost: '#735797',
	dragon: '#6F35FC',
	dark: '#705746',
	steel: '#B7B7CE',
	fairy: '#D685AD',
}

export const Card = ({
  title,
  imageUrl,
  body,
  type
}) => {
  const checkType = colours[type] ? colours[type] : 'none';
  return (
    <div className="card-container" style={{ boxShadow: `0px 0px 15px -5px ${checkType}`}}>
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
