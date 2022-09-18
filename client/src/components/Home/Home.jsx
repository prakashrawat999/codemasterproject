import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './Home.css';
import { NavLink } from 'react-router-dom';
import { BrowserView } from "react-device-detect";
import CoverVideo from './CoverVideo'
import Typewriter from 'typewriter-effect';

const Home = (props) => {

    const [Isuser, setIsuser] = useState("0")

    const checkForUser = async () => {
        try {
            const res = await fetch('/checkforUser', {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            const data = await res.json();
            // console.log(data.isuser);
            setIsuser(data.isuser);
            if (!(res.status === 200)) {
                throw new Error(res.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkForUser();
    }, [])

    useEffect(() => {
        if (props.isLogout === "1") {
            // props.setIsLogout("0")
            window.location.reload();
        }
    }, [props.isLogout])

    return (
        <>
            <BrowserView>
                <div>

                    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                        <div className="container">
                            <NavLink exact to="/" className="navbar-brand" href="#"> Code Master 🖥️</NavLink>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav ml-auto">
                                    <li className="nav-item active">
                                        <NavLink className="nav-link my-link" to="/">Home 🏡</NavLink>
                                    </li>
                                    &nbsp;&nbsp;
                                    <li className="nav-item active">
                                        <NavLink className="nav-link my-link" to="/">About 🎱</NavLink>
                                    </li>&nbsp;&nbsp;
                                    {Isuser === '0'
                                        ?<>
                                        <li className="nav-item active">
                                                <NavLink className="nav-link my-link" to="/signup">Sign Up 😄</NavLink>
                                        </li>
                                        &nbsp;&nbsp;
                                        <li className="nav-item active">
                                            <NavLink className="nav-link my-link" to="/login">Log In 🔑</NavLink>
                                        </li>
                                        </>
                                        :
                                        <>
                                        <li className="nav-item active" style={{ display: "none" }}>
                                            <NavLink className="nav-link my-link" to="/login">Log In</NavLink>
                                        </li>
                                        &nbsp;&nbsp;
                                        <li className="nav-item active" style={{ display: "none" }}>
                                                <NavLink className="nav-link my-link" to="/signup">Sign Up 😄</NavLink>
                                        </li>
                                        </>
                                    }

                                    {Isuser === '0'
                                        ?
                                        <li className="nav-item active" style={{ display: "none" }}>
                                            <NavLink className="nav-link my-link" to="/logout">Logout</NavLink>
                                        </li>
                                        :
                                        <li className="nav-item active">
                                            <NavLink className="nav-link my-link" to="/logout">Logout 😺</NavLink>
                                        </li>
                                    }
                                </ul>

                            </div>
                        </div>
                    </nav>

                    <header className="headerClass">
                        <div className="container">
                            <div className="banner-text">
                                <div className='box'>
                                    <h2 style={{marginTop: "60px", marginRight: "30px"}}>
                                        <h2 style={{ color: "black"}}>We make programming rock 😸 </h2>
                                        <Typewriter
                                            onInit={(typewriter) => {
                                                typewriter.typeString('<span class="text-1">Hey Developers 🖐️</span>')
                                                    .pauseFor(2000)
                                                    .deleteAll()
                                                    .typeString('<span class="text-2">Code and Collab 😻</span>')
                                                    .pauseFor(2000)
                                                    .deleteAll()
                                                    .typeString('<span class="text-3">Explore and Solve 💻</span>')
                                                    .pauseFor(2000)
                                                    .deleteAll()
                                                    .start()
                                            }}

                                            options={{ autoStart: true, loop: true }}
                                        />
                                    </h2>

                                    <p className="banner-btn">                                        
                                        {Isuser === '0'
                                            ?
                                            <Link to="/rooms" title="Sign In to access room">Code Room</Link>
                                            :
                                            <Link to="/rooms">Code Room</Link>

                                        }
                                    </p>
                                </div>
                                <div className='box'>
                                    <CoverVideo />
                                </div>
                            </div>
                        </div>
                    </header>
                </div>
            </BrowserView>
        </>
    )
}

export default Home
