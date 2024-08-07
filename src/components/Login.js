import { Link, useNavigate } from "react-router-dom";
import logo from '../logo.svg';
import loginImg from '../assets/img/img-01.jpg';
import { useState } from "react";
function Login() {

    const apiBaseUrl = process.env.REACT_APP_API_URL;
    const [email, setEmail] = useState("");
    const [user_password, setUser_password] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); 

    async function UserLogin(e) {
        e.preventDefault();
        localStorage.clear();
        try {
            let formdata = {};
            formdata['email'] = email;
            formdata['user_password'] = user_password;
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            let res = await fetch(apiBaseUrl + "/user/login", {
                method: "POST",
                body: JSON.stringify(formdata),
                headers: headers
            });
            let resJson = await res.json();
            if (resJson.status===true) {
                resJson.result['isLoggenIn'] = true;
                resJson.result['token'] = resJson.token;
                localStorage.setItem("userInfo", JSON.stringify(resJson.result));
                navigate("/dashboard");
                return;
            }else{
                console.log(resJson);
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div className="container-fluid " style={{
                backgroundImage: `url(${loginImg})`,
                backgroundSize: 'cover', // Optional: cover the entire element
                backgroundPosition: 'center', // Optional: center the background image
                width: '100%', // Optional: set width
                height: '100vh', // Optional: set height
                marginTop: '-25px',
            }}>
                <div className="row mt-4">
                    <div className="col-sm-7 mt-5">
                        <div className="p-4" style={{ marginTop: '100px' }}>
                            <h2 className="text-white" style={{ padding: '10px', border: '1px solid #8bb949', borderLeft: '10px solid #8bb949' }}>Meeting Room Booking </h2>
                            <p className="text-white" style={{ padding: '10px', border: '1px dotted #8bb949', background: '#8bb949', opacity: '0.8' }}>Booking a meeting room typically involves managing reservations, handling conflicts, and ensuring that the process is smooth for users. Implementing a meeting room booking system can range from a simple internal tool to a complex application integrated with calendars and other systems.</p>
                        </div>
                    </div>
                    <main className="col-md-4 mt-5" >
                        <div className="card mb-4 rounded-3 shadow-sm" style={{ opacity: "0.8", backgroundColor: "cyan", paddingLeft: "30px", paddingRight: "30px" }}>
                            {/* <div className="card-header py-3">
                                <h4 className="my-0 fw-normal">Login</h4>
                            </div> */}
                            <div className="card-body">
                                <div className="text-center">
                                    <img src={logo} style={{ height: '100px' }} />
                                </div>
                                <form>
                                    <div className="row">
                                        <div className="form-group mt-3">
                                            <label className="form-label">Email ID</label>
                                            <input type="text" className="form-control" onChange={(e) => setEmail(e.target.value)} placeholder="" style={{ backgroundColor: "cyan", border: "1px solid #09a1a1" }} />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label className="form-label">Password</label>
                                            <input type="password" autoComplete="off" className="form-control" onChange={(e) => setUser_password(e.target.value)} placeholder="" style={{ backgroundColor: "cyan", border: "1px solid #09a1a1" }} />
                                        </div>
                                        <div className="form-group mt-3">
                                            <button onClick={UserLogin} className="btn btn-primary float-end">Login</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default Login;