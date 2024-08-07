import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import CalendarHelper from "../CalendarHelper";
import MyCalendar from "../MyCalendar";
import CustomCalendar from "../CustomCalendar";
import Moment from 'react-moment';
import Swal from 'sweetalert2';

import { useNavigate } from "react-router-dom";
function NewBooking() {
    const apiBaseUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const TOKEN = userInfo.token;
    const [errors, setErrors] = useState({});
    const [rooms, setRooms] = useState([]);
    const [alreadyBookings, setAlreadyBookings] = useState([]);
    const [inputFormData, setInputFormData] = useState({
        room_id: "",
        start_time: "",
        end_time: "",
        purpose: ""
    });

    useEffect(() => {
        getRoom();
    }, [])

    const getRoom = async () => {
        try {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            headers.append('authorization', 'Bearer ' + TOKEN);
            const response = await fetch(apiBaseUrl + "/room", {
                method: "GET",
                headers: headers
            });
            const res = await response.json();
            setRooms(res.result);
        } catch (error) {
            console.error(error);
        }
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputFormData({
            ...inputFormData,
            [name]: value
        });
    }

    const validateForm = (data) => {
        let errors = {};
        // Validate name
        if (!data.room_id || !data.room_id.trim()) {
            errors.room_id = 'Room is required';
        }
        if (!data.start_time || !data.start_time.trim()) {
            errors.start_time = 'Start Time is required';
        }

        if (!data.end_time || !data.end_time.trim()) {
            errors.end_time = 'End Time is required';
        }

        if (!data.purpose || !data.purpose.trim()) {
            errors.purpose = 'Purpose is required';
        }
        return errors;
    };

    async function saveBooking(e) {
        e.preventDefault();
        inputFormData['user_id'] = userInfo._id;
        const validationErrors = validateForm(inputFormData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {

            try {
                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                headers.append('Accept', 'application/json');
                headers.append('authorization', 'Bearer ' + TOKEN);
                let res = await fetch(apiBaseUrl + "/booking", {
                    method: "POST",
                    body: JSON.stringify(inputFormData),
                    headers: headers
                });
                let resJson = await res.json();
                if (resJson.status === true) {
                    Swal.fire({
                        // title: "WFH Request",
                        width: "350",
                        text: "Room Booked Successfully.",
                        // icon: "success"
                    }).then(function () {
                        navigate("/booking");
                    return;
                    });
                } else if (resJson.status === 11000) {
                    setAlreadyBookings(resJson.result);
                    console.log(resJson.result);
                    Toast.fire({
                        icon: 'error',
                        title: 'Room not available',
                    });
                } else {
                    console.log(resJson);
                    Swal.fire({
                        title: "Error",
                        text: "Something went wrong",// resJson.message,
                        icon: "warning"
                    });
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log('Form has validation errors.', errors);
        }
    }


    const Toast = Swal.mixin({
        toast: true,
        // position: 'center',
        position: 'top-end',
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
    })

    return (
        <>
            <Layout>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h4">Book Room </h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group me-2">

                        </div>

                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <form onSubmit={saveBooking}>
                            <div className="row">
                                <div className="col-sm-12">
                                    <label className="form-label">Room *</label>
                                    <select className="form-control" name="room_id" value={inputFormData.room_id} onChange={handleInputChange} >
                                        <option value="">Select Room</option>
                                        {rooms?.map((room, index) => (
                                            <option value={room._id} key={index}>{room.room_name} ({room.location}) </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-sm-6 mt-2">
                                    <label className="form-label">Start Time *</label>
                                    <input type="datetime-local" name="start_time" value={inputFormData.start_time} onChange={handleInputChange} className="form-control" />
                                </div>

                                <div className="col-sm-6 mt-2">
                                    <label className="form-label">End Time *</label>
                                    <input type="datetime-local" className="form-control" name="end_time" value={inputFormData.end_time} onChange={handleInputChange} />
                                </div>
                                <div className="col-sm-12 mt-2">
                                    <label className="form-label">Purpose *</label>
                                    <textarea className="form-control" rows={5} name="purpose" value={inputFormData.purpose} onChange={handleInputChange}></textarea>
                                </div>

                                {/* <div className="col-sm-12 mt-2">
                                    <CalendarHelper 
                                        startAccessor="start"
                                        endAccessor="end"
                                    />
                                </div> */}


                                {/* <div className="col-sm-12 mt-4">
                                    <MyCalendar 
                                        startAccessor="start"
                                        endAccessor="end"
                                    />
                                </div> */}

                                {/* <div className="col-sm-12 mt-4">
                                    <CustomCalendar 
                                        startAccessor="start"
                                        endAccessor="end"
                                    />
                                </div> */}


                                <div className="col-sm-12 mt-2">
                                    <button type="submit" className="btn btn-sm btn-outline-secondary float-end">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {alreadyBookings.length > 0 &&


                    <div className="row">
                        <h4>Room not available for this timing. Already bookings is listed bellow.</h4>
                        {alreadyBookings?.map((alreadyBooking, index) => (
                            <div className="col-md-6" key={index}>
                                <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                                    <div className="col p-4 d-flex flex-column position-static">
                                        <strong class="d-inline-block mb-2 text-success">{alreadyBooking.purpose}</strong>
                                        {/* <h3 class="mb-0">{alreadyBooking.purpose}</h3> */}
                                        <div class="mb-1 text-muted">
                                            <Moment format="DD-MM-YYYY HH:mm">{alreadyBooking.start_time}</Moment> <b> To </b>
                                            <Moment format="DD-MM-YYYY HH:mm">{alreadyBooking.end_time}</Moment>
                                        </div>
                                        {/* <p class="mb-auto">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
                                    <a href="#" class="stretched-link">Continue reading</a> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </Layout>
        </>
    )
}

export default NewBooking;