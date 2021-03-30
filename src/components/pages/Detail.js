import React, { useState, useEffect } from 'react'
import './Detail.css'
import { Row, Col } from 'react-simple-flex-grid'
import { Button } from '../external/Button'
import Loading from '../external/Loading'
import ReactModal from 'react-modal'
ReactModal.setAppElement('#root');
function Detail(props) {
    const[detail, setDetail] = useState({})
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [caught, setCaught] = useState(null);
    const [nickname, setNickname] = useState('');
    const [isExist, setIsExist] = useState(false);
    
    const handleOpenModal = () => {
        setShowModal(true);
    }
    
    const handleCloseModal = () => {
        setShowModal(false);
    }
    useEffect (() => {
        let mypokemon = JSON.parse(localStorage.getItem("mypokemon"));

        if(mypokemon===null || !Array.isArray(mypokemon.data)){
            mypokemon={
                data:[]
            }
        }
        localStorage.setItem("mypokemon", JSON.stringify(mypokemon));

        setIsLoaded(false);
        const detailQuery =  `query pokemon($name: String!) {
            pokemon(name: $name) {
              id
              name
              abilities {
                ability {
                  name
                }
              }
              moves{
                move{
                  url
                  name
                }
                version_group_details{
                  level_learned_at
                  move_learn_method{
                    url
                    name
                  }
                  version_group{
                    url
                    name
                  }
                }
              }
              types {
                type {
                  name
                }
              }
              stats{
                base_stat
                effort
                stat{
                  url
                  name
                }
              }
              sprites{
                front_default
              }
            }
          }`;
        const fetchPokemon = async() => {
            fetch('https://graphql-pokeapi.vercel.app/api/graphql', {
                credentials: 'omit',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  query: detailQuery,
                  variables: {
                    name:props.match.params.name
                  },
                }),
                method: 'POST'
              })
            .then((res) => res.json())
            .then((res)=>{
                setDetail(res.data.pokemon);
                setIsLoaded(true);
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
        };
        fetchPokemon();
    },[]);

    const handleCatch = () => {
        let success = Math.random(0,1);
        console.log(success);
        if(success>=0.5) setCaught(true);
        else setCaught(false);
        handleOpenModal();
    }

    const onInputChange = (e) => {
        let mypokemon = JSON.parse(localStorage.getItem("mypokemon"));
        if(mypokemon.data.find(x=>x.nickname===e.target.value && x.name===detail.name)){
            setIsExist(true);
        }else{
            setIsExist(false);
        }
        setNickname(e.target.value);
    }

    const handleSave = () => {
        if(isExist) return;
        let mypokemon = JSON.parse(localStorage.getItem("mypokemon"));
        console.log(mypokemon);
        let newdata = {
            id: detail.id,
            name: detail.name,
            image: detail.sprites.front_default,
            types: detail.types,
            nickname: nickname
        }
        mypokemon.data.push(newdata);
        localStorage.setItem("mypokemon", JSON.stringify(mypokemon))
        setNickname('');
        handleCloseModal();
        props.history.push('/');
    }
    console.log(detail)
    return (
        <div className="container" style={{marginTop:'5%', textAlign:'center', padding:'20px'}}>
            {
                isLoaded ? 
                <>
                    <div id="detailContainer" className="detail-container">
                        <div className="detail-image">
                            <img src={detail.sprites.front_default} alt=""></img>
                        </div>
                        <div className="detail-title">
                            <h1>{detail.name.charAt(0).toUpperCase() + detail.name.slice(1)}</h1>
                        </div>
                        <div className="detail-body">
                            <Row className="body-row">
                                <Col span={12}>
                                    {detail.types.map((x, index)=>(
                                        <span className={`badge badge-${x.type.name}`} key={index}>{x.type.name}</span>
                                    ))}
                                </Col>
                            </Row>
                            <Row gutter={5} className="body-row">
                                <Col span={12} style={{marginBottom:'20px'}}>
                                    <h2>Base Stats</h2>
                                </Col>
                                <Col span={2}>
                                    HP
                                </Col>
                                <Col span={10}>
                                    <div className="status-bar">
                                        <div className="bar health" style={{width:`${(detail.stats.find(x=>x.stat.name==='hp').base_stat/200)*100}%`}}>
                                            {detail.stats.find(x=>x.stat.name==='speed').base_stat}/200
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={5} className="body-row">
                                <Col span={2}>
                                    ATK
                                </Col>
                                <Col span={10}>
                                    <div className="status-bar">
                                        <div className="bar attack" style={{width:`${(detail.stats.find(x=>x.stat.name==='attack').base_stat/200)*100}%`}}>
                                            {detail.stats.find(x=>x.stat.name==='speed').base_stat}/200
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={5} className="body-row">
                                <Col span={2}>
                                    DEF
                                </Col>
                                <Col span={10}>
                                    <div className="status-bar">
                                        <div className="bar defense" style={{width:`${(detail.stats.find(x=>x.stat.name==='defense').base_stat/200)*100}%`}}>
                                            {detail.stats.find(x=>x.stat.name==='speed').base_stat}/200
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={5} className="body-row">
                                <Col span={2}>
                                    SPD
                                </Col>
                                <Col span={10}>
                                    <div className="status-bar">
                                        <div className="bar speed" style={{width:`${(detail.stats.find(x=>x.stat.name==='speed').base_stat/200)*100}%`}}>
                                            {detail.stats.find(x=>x.stat.name==='speed').base_stat}/200
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="body-row">
                                <Col span={12} style={{marginBottom:'10px', marginTop:'10px'}}>
                                    <h2>Moves</h2>
                                </Col>
                            </Row>
                            
                            <Row className="body-row" style={{marginBottom:'10px', marginTop:'10px'}}>
                                <Col span={2}>
                                    <b>Level</b>
                                </Col>
                                <Col span={10}>
                                    <b>Move Name</b>
                                </Col>
                            </Row>
                            {
                                detail.moves.sort((a,b)=> a.version_group_details[0].level_learned_at - b.version_group_details[0].level_learned_at).map((mv,index)=>(
                                    <Row key={`row-${index}`}>
                                        <Col span={2}>
                                            {mv.version_group_details[0].level_learned_at}
                                        </Col>
                                        <Col span={10}>
                                            {mv.move.name}
                                        </Col>
                                    </Row>
                                ))
                            }
                            <Row gutter={5} className="body-row">
                                <Col span={12}>
                                    <Button buttonText="Catch" onClick={handleCatch} buttonStyle="btn--outline" buttonSize="btn--large" buttonColor="red" ></Button>
                                </Col>
                            </Row>
                            
                        </div>  
                    </div>
                    
                    <ReactModal 
                                isOpen={showModal}
                                contentLabel="Minimal Modal Example"
                                style={{
                                    content : {
                                        top : '50%',
                                        left : '50%',
                                        right : 'auto',
                                        bottom : 'auto',
                                        marginRight : '-50%',
                                        transform : 'translate(-50%, -50%)',
                                        minWidth : '300px',
                                        maxWidth : '350px',
                                        backgroundColor : '#fcfcfc'
                                      }
                                    }
                                }   
                                >
                                <Row>   
                                    <Col span={12}>
                                        <h1 style={{color: caught ? '#7AC74C' : '#C22E28', textAlign:'center'}}>{caught ? 'CONGRATULATION!' : 'FAILED'}</h1>
                                        <h3 style={{textAlign:'center'}}>{caught ? `You have caught ${detail.name.charAt(0).toUpperCase() + detail.name.slice(1)}`:''}</h3>
                                    </Col>
                                </Row>
                                {   caught &&
                                    ( 
                                        <Row style={{
                                        marginTop:'20px'
                                        }}>   
                                            <Col span={4} style={{
                                                paddingTop:'5px'
                                            }}>
                                                <label>Nickname:</label>
                                            </Col>
                                            <Col span={8}>
                                                <input 
                                                    name="nickname" 
                                                    type="text" 
                                                    placeholder="Give Nickname" 
                                                    onChange={onInputChange} 
                                                    value={nickname} 
                                                    style={
                                                        {
                                                            width:'100%',
                                                            height:'30px', 
                                                            border:'thin solid', 
                                                            padding: '0 5px 0 5px'
                                                        }
                                                    }
                                                />
                                            </Col>
                                            {
                                                isExist && (
                                                    <Col span={12} style={{
                                                        paddingTop:'5px'
                                                    }}>
                                                        <span className="badge-alert">Nickname already used by other Pokemon</span>
                                                    </Col>
                                                )
                                            }
                                        </Row>
                                    )
                                }
                                
                                <Row style={{
                                    marginTop:'20px'
                                }}>   
                                    <Col span={12} style={{
                                        textAlign:'right'
                                    }}>
                                        <Button buttonText="Close" onClick={handleCloseModal} buttonStyle="btn--outline" buttonSize="btn--medium" style={{ marginRight: '5px'}}></Button>
                                        {
                                            caught && (<Button buttonText="Save" onClick={handleSave} buttonStyle="btn--outline" buttonSize="btn--medium" buttonColor="blue" ></Button>)
                                        }
                                    </Col>
                                </Row>
                    </ReactModal>
                </> 
                :
                <Loading/>
            }
        </div>
    )
}

export default Detail
