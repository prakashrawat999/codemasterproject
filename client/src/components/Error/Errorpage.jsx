import React from 'react'
import { NavLink } from 'react-router-dom';
const Errorpage = () => {
    return (
        <div style={{height:"100vh",  backgroundPosition: 'center', backgroundRepeat:'no-repeat', backgroundSize: '100%, 100%'}}>
            <header className="bg-dark">
                <div className="container">
                    <div className="banner-text">
                        <h1 className="text-white">ERROR 404</h1>
                        <h1 className="text-white">PAGE NOT FOUND</h1><br></br>
                        <p className="banner-btn text-white">
                        <br/>
                        <NavLink to="/">Go back to Home</NavLink>
                        </p>
                    </div>
                </div>
            </header>



        </div>
    )
}

export default Errorpage
