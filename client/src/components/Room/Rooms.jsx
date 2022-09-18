import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { v4 as uuidV4 } from "uuid";
import roombackground from './../../assets/codeMaster.jpeg'
import './Rooms.css';
import Typewriter from 'typewriter-effect';

const Rooms = (props) => {

    const history = useHistory();
    const [userData, setUserData] = useState({});

    const checkForAuthentication = async () => {
        try {
            const res = await fetch('/roomsforuser', {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            const data = await res.json();
            setUserData(data);
            props.setNameOfUser(data.userName);

            if (!(res.status === 200)) {
                throw new Error(res.error);
            }
        } catch (error) {
            console.log("Error 😢");
            console.log(error);
            history.push("/login");
        }
    }

    const [roomCode, setroomCode] = useState("");

    const generateRoomCode = () => {
        let text = uuidV4();
        setroomCode(text)
    }

    useEffect(() => {
        checkForAuthentication();
    }, []);

    const socket = props.socket;

    useEffect(() => {
        if (roomCode !== "") {
            socket.emit('created-room', roomCode)
            console.log('room created, you can join 👍')
            history.push(`/room/${roomCode}`)
        }

    }, [roomCode]);
    
    const [joinRoom, setJoinRoom] = useState("");
    const [roomLink, setRoomLink] = useState("");

    const generateJoinRoomCode = () => {
        if (joinRoom !== "") {
            setRoomLink(joinRoom);
        }

    }

    useEffect(() => {
        if (roomLink !== "") {
            socket.emit('create-room', roomLink);
            console.log('joined 👍');
            history.push(`/room/${roomLink}`);
        }

    }, [roomLink]);


    return (
        <div style={{ height: "100vh", backgroundImage: `url(${roombackground})`, marginLeft: "50px", marginTop: "15px", backgroundPosition: 'left', backgroundRepeat: 'no-repeat', backgroundSize: '35%' }}>

            <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
                <div className="container">
                    <NavLink exact to="/" className="navbar-brand" href="#">Code Master 🖥️</NavLink>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item active">
                                <NavLink className="nav-link roomsLink" to="/">Home 🏡</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <header>
                <div className="container">
                    <div className="roombanner">
                        <h2>Hey🖐️ {userData.userName}
                            <Typewriter
                                onInit={(typewriter) => {
                                    typewriter
                                        .typeString("Wlcm to Code Master 🥳")
                                        .pauseFor(1000)
                                        .deleteAll()
                                        .typeString("Create Your CodeRoom 🏠")
                                        .pauseFor(1000)
                                        .deleteAll()
                                        .typeString("Live Web < CodeMaster />")
                                        .pauseFor(1000)
                                        .deleteAll()
                                        .start();
                                }}

                                options={{ autoStart: true, loop: true }}
                            />
                        </h2>

                        <p className="secont">
                            <a className="roombtn" size="large" variant="contained" onClick={generateRoomCode} >
                                Create Code Room
                            </a>
                            <a className="roombtn" size="large" variant="contained" data-toggle="modal" data-target="#exampleModal">
                                Join Code Room
                            </a>
                            <a className="roombtn" size="large" variant="contained" >
                            <NavLink to="/web" style={{ color: "inherit", textDecoration: "inherit"}}>
                                    Web Dev
                           </NavLink>
                            </a>
                        </p>
                    </div>
                </div>
            </header>


            <div className="container" >
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{userData.userName} Join Code Room 💻</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group mb-0">
                                        {/* <label for="exampleFormControlInput1">Email address</label> */}
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                            placeholder="Enter Room Code 😶"
                                            value={joinRoom}
                                            onChange={(e) => {
                                                setJoinRoom(e.target.value);
                                                console.log("joinRoom : " + joinRoom);
                                            }} 
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger mr-auto" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-success" data-dismiss="modal" onClick={generateJoinRoomCode}>Join Room</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Rooms;
