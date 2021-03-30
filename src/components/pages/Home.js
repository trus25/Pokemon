import React, {useState, useEffect } from 'react'
import { Row, Col } from 'react-simple-flex-grid'
import { Card } from '../external/Card.js'
import Loading from '../external/Loading'
import '../external/Paginate.css'
import ReactPaginate from 'react-paginate';
import { Button } from '../external/Button'
function Home() {
    // const [pokemon, setPokemon] = useState([])
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState({});

    const [offset, setOffset] = useState(0);
    const [perPage] = useState(12);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        setIsLoaded(false);
        let mypokemon = JSON.parse(localStorage.getItem("mypokemon"));
        if(mypokemon!==null || Array.isArray(mypokemon.data)){
          let obj = {
            data:{
              pokemons:{
                count:mypokemon.data.length,
                results:mypokemon.data.slice(offset,offset+perPage)
              }
            }
          }
          setItems(obj);
          setPageCount(Math.ceil(mypokemon.data.length / perPage));
          if(mypokemon.data.length===0) setError("NO POKEMON FOUND!");
        }else{
          setError("NO POKEMON FOUND!");
        }
        setIsLoaded(true);
    }, [offset])

    const handlePageClick = (e) => {
      const selectedPage = e.selected;
      setOffset(Math.ceil(selectedPage * perPage))
    };

    const handleRelease = (index) => {
      let mypokemon = JSON.parse(localStorage.getItem("mypokemon"));
      mypokemon.data.splice(index, 1);
      let newItem={
          data:mypokemon.data
      }
      localStorage.setItem("mypokemon", JSON.stringify(newItem));
      let obj = {
        data:{
          pokemons:{
            count:newItem.data.length,
            results:newItem.data.slice(offset,offset+perPage)
          }
        }
      }
      setItems(obj);
      setPageCount(Math.ceil(newItem.data.length / perPage));
      if(newItem.data.length===0) setError("NO POKEMON FOUND!")
    }

    return (
        <>
            {/* <Search /> */}
            <div className="container container-center" style={{marginTop:'20px'}}>
              <h1>MY POKEMON</h1>
            </div>
            <div className="container" style={{"marginTop": "20px"}}>
                { isLoaded ? (
                    error===null ?
                      <>
                      <Row gutter={20}>
                        {items.data.pokemons.results.map((dt,index)=>(
                            <Col xs={6} lg={3} style={{"marginTop": "20px"}} key={index}>
                                <Card imageUrl={dt.image} title={dt.nickname==='' ? ' ' : dt.nickname} type={dt.types[0].type.name} body={
                                  <>
                                  <Row>
                                    <Col span={12} style={{marginTop:'15px'}}>
                                      <span style={{fontStyle:'italic'}}>{dt.name.charAt(0).toUpperCase() + dt.name.slice(1)}</span>
                                    </Col>
                                    <Col span={12} style={{marginTop:'15px'}}>
                                      <Button buttonText="Release" onClick={()=>handleRelease(index)} buttonStyle="btn--outline" buttonSize="btn-medium" buttonColor="red" ></Button>
                                    </Col>
                                  </Row>
                                  </>
                                }>
                                </Card>
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

export default Home
