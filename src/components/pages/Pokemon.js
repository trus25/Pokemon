import React, {useState, useEffect } from 'react'
import { Row, Col } from 'react-simple-flex-grid'
import { Card } from '../external/Card.js'
import { Link } from 'react-router-dom'
import Loading from '../external/Loading'
import '../external/Paginate.css'
import ReactPaginate from 'react-paginate';
import { Button } from '../external/Button'
function Pokemon() {
    // const [pokemon, setPokemon] = useState([])
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState({});

    const [offset, setOffset] = useState(0);
    const [perPage] = useState(12);
    const [pageCount, setPageCount] = useState(0);
    const [mypokemon] = useState(()=> JSON.parse(localStorage.getItem("mypokemon")));
    const [refresh, setRefresh] = useState(false);

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
              setError("NO POKEMON FOUND!");
            }
          )
        }
        fetchPokemon();
      }, [offset])

    const handlePageClick = (e) => {
      const selectedPage = e.selected;
      setOffset(Math.ceil(selectedPage * perPage))
    };
    return (
        <>
            {/* <Search /> */}
            <div className="container container-center" style={{marginTop:'20px'}}>
              <h1>POKEMON LIST</h1>
            </div>
            <div className="container" style={{"marginTop": "20px"}}>
                { isLoaded ? 
                    (
                        error===null ?
                        <>
                            <Row gutter={20}>
                            {items.data.pokemons.results.map((dt,index)=>(
                                <Col xs={6} lg={3} style={{"marginTop": "20px"}} key={index}>
                                    <Link to={`/pokemon/${dt.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Card imageUrl={dt.image} title={dt.name.charAt(0).toUpperCase() + dt.name.slice(1)} type={dt.types[0].type.name} body={
                                            <span>Owned: { (mypokemon!==null && mypokemon.hasOwnProperty('data')) ? mypokemon.data.filter(x=>x.name===dt.name).length : 0}</span>
                                        }>
                                        </Card>
                                    </Link>
                                </Col>
                            ))}
                            </Row>
                        </> 
                        :
                        <div style={{
                            width:"100%",
                            textAlign:'center'
                          }}>
                            <h4>{error}</h4><br/>
                            <Button buttonText="Close" onClick={e=>setRefresh(!refresh)} buttonStyle="btn--outline" buttonSize="btn-small" style={{ marginRight: '5px'}}></Button>
                        </div> 
                    )
                    :
                    <Loading/>
                }
                {
                    error===null &&
                    <div style={{width:'100%', textAlign:'right'}}>
                        <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCount}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={2}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                        />
                    </div>
                }
            </div>
        </>
    )
}

export default Pokemon
