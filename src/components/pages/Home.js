import React, {useState, useEffect } from 'react'
import { Row, Col } from 'react-simple-flex-grid'
import './Home.css'
import Search from '../Search.js'
import { Card } from '../Card.js'
import { Link } from 'react-router-dom'
function Home() {
    // const [pokemon, setPokemon] = useState([])
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState({});
    const [details, setDetails] = useState([]);
    const itemQuery = `query pokemons($limit: Int, $offset: Int) {
        pokemons(limit: $limit, offset: $offset) {
          count
          next
          previous
          status
          message
          results {
            id
            url
            name
            image
          }
        }
      }`;
      
    const itemqueryVariables = {
        limit: 100,
        offset: 0,
    };

    const detailQuery =  `query pokemon($name: String!) {
      pokemon(name: $name) {
        name
        types {
          type {
            name
          }
        }
      }
    }`;

    useEffect(() => {
        const fetchPokemon = () =>{
          fetch('https://graphql-pokeapi.vercel.app/api/graphql', {
            credentials: 'omit',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: itemQuery,
              variables: itemqueryVariables,
            }),
            method: 'POST',
          })
          .then(res => res.json())
          .then(result => {
            Promise.all(result.data.pokemons.results.map(x=>fetch('https://graphql-pokeapi.vercel.app/api/graphql', {
              credentials: 'omit',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: detailQuery,
                variables: {
                  name:x.name
                },
              }),
              method: 'POST'
             })
             .then((res) => res.json())
             .then((res) =>{
               return res
             }))).then((values)=>{
                console.log(values)
                result.data.pokemons.results.forEach(x => {
                  x.types = values.find(res=>res.data.pokemon.name===x.name).data.pokemon.types;
                });
            })
              setItems(result);
              setIsLoaded(true);
            },
            (error) => {
              console.log(error)
              setIsLoaded(true);
              setError(error);
            }
          )
        }
        fetchPokemon()
      }, [])
      // setter
        localStorage.setItem('myData', items);
        
        // getter
        localStorage.getItem('myData');
        
        // remove
        localStorage.removeItem('myData');
        
        // remove all
        localStorage.clear();
        console.log(items)
    return (
        <>
            <Search />
            <div className="container" style={{"marginTop": "20px"}}>
                { isLoaded ? 
                    <>
                      <Row gutter={20}>
                        {items.data.pokemons.results.map((dt,index)=>(
                            <Col xs={6} sm={4} md={3} lg={2} style={{"marginTop": "20px"}} key={index}>
                                <Link to="/pokemon">
                                    <Card imageUrl={dt.image} title={dt.name.charAt(0).toUpperCase() + dt.name.slice(1)}>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                      </Row>
                    </> :
                    <div></div>
                }
                
            </div>
        </>
    )
}

export default Home
