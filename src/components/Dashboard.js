import { useEffect, useState } from "react";
import Layout from "../layouts/Layout";
import MyCustomCalendar from "./MyCustomCalendar";
import Highcharts, { color } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function Dashboard() {

    const apiBaseUrl = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const TOKEN = userInfo.token;
    const [totalUser, setTotalUser] = useState(0);
    const [totalRooms, setTotalRooms] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [todayTotalBooking, setTodayTotalBooking] = useState(0);
    const [roomWiseBookings, setRoomWiseBooking] = useState([]);
    const [userWiseBookings, setUserWiseBookings] = useState([]);
    const [allBookings, setAllBookings] = useState([]);

    useEffect(() => {
        const getAllData = async () => {
            try {
                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                headers.append('Accept', 'application/json');
                headers.append('authorization', 'Bearer ' + TOKEN);
                const response = await fetch(apiBaseUrl + "/dashboard", {
                    method: "GET",
                    headers: headers
                });
                const res = await response.json();
                if (res.status === true) {
                    setTotalUser(res.totalUser);
                    setTotalRooms(res.totalRoom);
                    setTotalBookings(res.totalBooking);
                    setRoomWiseBooking(res.roomWiseBookings);
                    setUserWiseBookings(res.userWiseBookings);
                    setAllBookings(res.allBookings);
                    setTodayTotalBooking(res.todayTotalBooking);
                } else {
                    console.log('Something went wrong');
                }

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        getAllData();
    }, []);

    // console.log(allBookings);
    //console.log(roomWiseBookings);
    const allRoomBookings = [];
    const roomWiseBookingSeries = roomWiseBookings.reduce((key, data) => {
        const roomBookings = {};
        roomBookings['name'] = data.room_details.room_name;
        roomBookings['y'] = data.total_bookings;
        allRoomBookings.push(roomBookings);
        return allRoomBookings;
    }, []);
    //console.log(roomWiseBookingSeries);

    const allUserBookings = [];
    const userWiseBookingSeries = userWiseBookings.reduce((key, data) => {
        const userBookings = {};
        userBookings['name'] = data.user_details.name;
        userBookings['y'] = data.total_bookings;
        allUserBookings.push(userBookings);
        return allUserBookings;
    }, []);



    /// ROOM WISE BOOKINGS
    const roomWiseOptions = {
        title: {
            text: ''
        },
        chart: {
            height: '300px',
            type: 'pie', // bar
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        yAxis: {
            labels: {
                enabled: false
            }
        },
        series: [{
            name: 'Total',
            data: roomWiseBookingSeries,
            // data: [
            //     { 'name': 'Pending', 'y': 27, 'color': '#f2ce3f' },
            //     { 'name': 'Approved', 'y': 34, 'color': 'green' },
            //     { 'name': 'Rejected', 'y': 12, 'color': 'red' }
            // ],
        }]
    };

    /// USER WISE BOOKINGS
    const userWiseBookingsOptions = {
        title: {
            text: ''
        },
        chart: {
            height: '300px',
            type: 'column' // bar
        },
        xAxis: {
            type: 'category',
            scrollbar: {
                enabled: true
            },
        },
        yAxis: {
            title: {
                text: 'Bookings'  // Y-axis title
            },
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Total',
            data: userWiseBookingSeries, //[['User-1', 27], ['User-2', 34], ['User-3', 39], ['User-4', 38], ['User-5', 42], ['User-6', 60], ['User-7', 29], ['User-8', 37], ['User-9', 43],],
        }]
    };


    // const [events, setEvents] = useState([
    //     {
    //         id: 1,
    //         title: 'Meeting with Team',
    //         start: new Date(),
    //         end: new Date(new Date().getTime() + 60 * 60 * 1000),
    //         description: 'Discuss project progress and next steps.',
    //     },
    //     {
    //         id: 2,
    //         title: 'Lunch with Client',
    //         start: new Date(new Date().setHours(12, 0, 0)),
    //         end: new Date(new Date().setHours(13, 0, 0)),
    //         description: 'Lunch at the new cafe downtown.',
    //     },
    // ]);

    // console.log(events);

    const allFormatedBookings = allBookings.map(item => ({
        ...item,
        start_time: new Date(item.start_time),
        end_time: new Date(item.end_time),
        title: item.purpose
        // created_at: new Date(item.created_at)
    }));
    //console.log(allFormatedBookings);

    return (
        <>
            <Layout>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h4">Dashboard  </h1>
                </div>
                <div className="row mb-4">
                    <div className="col-md-3" >
                        <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative n-box">
                            <div className="col-4 d-flex align-items-center justify-content-center icon-box"><i className="fa fa-users"></i></div>
                            <div className="col p-4 ps-0 d-flex flex-column position-static align-items-center">
                                <strong className="d-inline-block mb-2 text-success">Users</strong>
                                <h3 className="mb-0">{totalUser}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3" >
                        <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative n-box">
                            <div className="col-4 d-flex align-items-center justify-content-center icon-box"><i className="fa fa-building"></i></div>
                            <div className="col p-4 ps-0 d-flex flex-column position-static align-items-center">
                                <strong className="d-inline-block mb-2 text-success">Rooms</strong>
                                <h3 className="mb-0">{totalRooms}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3" >
                        <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative n-box">
                            <div className="col-4 d-flex align-items-center justify-content-center icon-box"><i className="fa fa-drivers-license"></i></div>
                            <div className="col p-4 ps-0 d-flex flex-column position-static align-items-center">
                                <strong className="d-inline-block mb-2 text-success">Bookings</strong>
                                <h3 className="mb-0">{totalBookings}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3" >
                        <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative n-box">
                            <div className="col-4 d-flex align-items-center justify-content-center icon-box"><i className="fa fa-calendar"></i></div>
                            <div className="col p-4 ps-0 d-flex flex-column position-static align-items-center">
                                <strong className="d-inline-block mb-2 text-success">Today Bookings</strong>
                                <h3 className="mb-0">{todayTotalBooking}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div className="card">
                            <div className="card-header">Rooms Wise Bookings</div>
                            <div className="card-body" >
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={roomWiseOptions}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-8">
                        <div className="card">
                            <div className="card-header">User Wise Bookings</div>
                            <div className="card-body" >
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={userWiseBookingsOptions}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-12 mt-4">
                        <div className="card">
                            <div className="card-header">This month's meetings are scheduled</div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12 " style={{ height: '500px' }}>
                                        <MyCustomCalendar
                                            startAccessor="start_time"
                                            endAccessor="end_time"
                                            events={allFormatedBookings}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>





            </Layout>
        </>
    )
}

export default Dashboard;