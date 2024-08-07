
import './App.css';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Room from './components/rooms/Room';
import User from './components/users/User';
import Dashboard from './components/Dashboard';
import Booking from './components/bookings/Booking';
import AddUser from './components/users/AddUser';
import AddRoom from './components/rooms/AddRoom';
import NewBooking from './components/bookings/NewBooking';
import EditRoom from './components/rooms/EditRoom';
import EditUser from './components/users/EditUser';
import EditBooking from './components/bookings/EditBooking';
import { useEffect } from 'react';

function PrivateRoute(props) {
  console.log('Check Authentication--');
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const TOKEN = userInfo?.token;
  const navigate = useNavigate();
 
  checkLogin();
  async function checkLogin() {
    //console.log('calll');
    try {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('authorization', 'Bearer ' + userInfo.token)
      const response = await fetch(apiBaseUrl + "/user/check-login", {
        method: "GET",
        headers: headers
      });
      const resJson = await response.json();
      if (resJson.status === true) {
        resJson.result['isLoggenIn'] = true;
        resJson.result['token'] = resJson.token;
        localStorage.setItem("userInfo", JSON.stringify(resJson.result));
      }else{
        localStorage.clear();
        navigate("/");
        return;
      }

    } catch (error) {
      // console.error('Error fetching users:', error);
      localStorage.clear();
      navigate("/"); 
      return;
    }
  }
  return (<> {props.page} </>);
  // if (props.auth) {
  //   return (<> {props.page} </>);
  // } else {

  // }
  // return (<> <Login /> </>);
}

function App() {
  // const apiBaseUrl = process.env.REACT_APP_API_URL;
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // const TOKEN = userInfo?.token;


  // useEffect(() => {
  //   async function checkLogin() {
  //     try {

  //       let headers = new Headers();
  //       headers.append('Content-Type', 'application/json');
  //       headers.append('Accept', 'application/json');
  //       headers.append('authorization', 'Bearer ' + userInfo.token)
  //       const response = await fetch(apiBaseUrl+"/user/check-login", {
  //         method: "GET",
  //         headers: headers
  //       });
  //       const resJson = await response.json();
  //       if(resJson.status===true){
  //         resJson.result['isLoggenIn'] = true;
  //         resJson.result['token'] = resJson.token;
  //         localStorage.setItem("userInfo", JSON.stringify(resJson.result));
  //       }

  //     } catch (error) {
  //       // console.error('Error fetching users:', error);
  //       localStorage.clear();
  //       // navigate("/");
  //       // return;
  //     }
  //   }
  //   checkLogin();
  // }, []);

  return (
    <BrowserRouter>
      <Routes >
        <Route path='/' element={<Login />} />
        {/* <Route path='/dashboard' element={<Dashboard/> } /> */}
        <Route path='/dashboard' element={<PrivateRoute page={<Dashboard />} />} />
        <Route path='/room' element={<PrivateRoute page={<Room />} />}  />
        <Route path='/add-room' element={<PrivateRoute page={<AddRoom />} />}  />
        <Route path='/edit-room/:id' element={<PrivateRoute page={<EditRoom />} />} />
        <Route path='/user' element={<PrivateRoute page={<User />} />} />
        <Route path='/add-user' element={<PrivateRoute page={<AddUser />} />} />
        <Route path='/edit-user/:id' element={<PrivateRoute page={<EditUser />} />}  />
        <Route path='/booking' element={<PrivateRoute page={<Booking />} />}  />
        <Route path='/new-booking' element={<PrivateRoute page={<NewBooking />} />} />
        <Route path='/edit-booking/:id' element={<PrivateRoute page={<EditBooking />} />}  />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
