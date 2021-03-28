import React, {useState, useEffect } from 'react'
import { Row, Col } from 'react-simple-flex-grid'
import './Home.css'
import Search from '../external/Search.js'
import { Card } from '../external/Card.js'
import { Link } from 'react-router-dom'
import Loading from '../external/Loading'
import '../external/Paginate.css'
import ReactPaginate from 'react-paginate';
function Home() {
    // const [pokemon, setPokemon] = useState([])
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState({});

    const [offset, setOffset] = useState(0);
    const [data, setData] = useState([]);
    const [perPage] = useState(12);
    const [pageCount, setPageCount] = useState(0);
    const [mypokemon] = useState(()=> JSON.parse(localStorage.getItem("mypokemon")));

    useEffect(() => {
        setIsLoaded(false);
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
            limit: perPage,
            offset: offset,
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
        const fetchPokemon = async() =>{
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
              .then((res) => res.json()))).then((values)=>{
                  result.data.pokemons.results.forEach(x => {
                    x.types = values.find(res=>res.data.pokemon.name===x.name).data.pokemon.types;
                  });
                  setItems(result);
                  setIsLoaded(true);
                  setPageCount(Math.ceil(result.data.pokemons.count / perPage))
              })
            },
            (error) => {
              console.log(error)
              setIsLoaded(true);
              setError(error);
            }
          )
        }
        fetchPokemon();
      }, [offset])

    const handlePageClick = (e) => {
      const selectedPage = e.selected;
      setOffset(Math.ceil(selectedPage * perPage))
    };
    console.log(items)
    return (
        <>
            <Search />
            <div className="container" style={{"marginTop": "20px"}}>
                { isLoaded ? 
                    <>
                      <Row gutter={20}>
                        {items.data.pokemons.results.map((dt,index)=>(
                            <Col xs={6} lg={3} style={{"marginTop": "20px"}} key={index}>
                                <Link to={`/pokemon/${dt.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Card imageUrl={dt.image} title={dt.name.charAt(0).toUpperCase() + dt.name.slice(1)} type={dt.types[0].type.name} body={
                                      <span>Owned: {}</span>
                                    }>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                      </Row>
                    </> :
                    <Loading/>
                }
                <div style={{width:'100%', textAlign:'center'}}>
                  <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                    />
                </div>
            </div>
        </>
    )
}

export default Home
