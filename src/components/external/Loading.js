import React from 'react'
import './Loading.css'
function Loading() {
    return (
        <div className="loadingContainer">
          <img src={process.env.PUBLIC_URL + '/images/pokemon.png'} alt="pokemon" className="loading" />  
        </div>
    )
}

export default Loading
