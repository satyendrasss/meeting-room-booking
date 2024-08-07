import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../logo.svg';

function Header() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const navigate = useNavigate();
    function logout() {
        console.log('call logout...');
        localStorage.clear();
        window.location.href = '/';
        return;
    }
    
    return (
        <>
            <header className="navbar navbar-light sticky-top bg-light flex-md-nowrap p-0 shadow">
                {/* <Link className="navbar-brand col-md-3 col-lg-2 me-0 px-3" to="/dashboard">PC CONSULTING</Link> */}
                <img src={logo} className="navbar-brand col-md-3 col-lg-2 me-0 px-3" style={{height:'80px'}} />
                {/* <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button> */}
                {/* <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" /> */}
                <div className="navbar-nav">
                    <div className="nav-item text-nowrap d-flex">
                        <Link className="nav-link px-3" to="#">{userInfo?.name} -{userInfo?.role} </Link>
                        <Link className="nav-link px-3" onClick={() => logout()} ><i className="fa fa-sign-out"></i> </Link>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;