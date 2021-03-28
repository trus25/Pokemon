import React, { useState } from 'react'
import { Button } from './Button';
import './Search.css'
function Search() {
  const [value, setValue] = useState("");
  const handleChange = (event) => {
    setValue(event.target.value);
  }
  return (
      <div className="container container-center">
        <input className="searchbar" type="text" value={value} onChange={handleChange}/>
        <Button buttonText="Find" buttonSize="btn--large" buttonStyle="btn--outline" buttonColor="red" additionalClass="btn-search"></Button>  
      </div>
  )
}

export default Search
