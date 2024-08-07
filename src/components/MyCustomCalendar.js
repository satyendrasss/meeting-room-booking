import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


// This calendar only for view event details 

function MyCustomCalendar({ events }) {
    const locales = {
        'en-US': enUS,
    };

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
    });


    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    const formatDate = (date) => {
        return date ? format(new Date(date), 'Pp') : 'N/A';
    };

    return (
        <>
            {/* <div style={{ height: '100vh' }}> */}
            <div style={{ height: '100%' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start_time"
                    endAccessor="end_time"
                    selectable
                    onSelectEvent={handleSelectEvent}
                    style={{ height: '100%' }}
                />

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton style={{backgroundColor:'#afdd82'}}>
                        <Modal.Title>Booking Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul className="list-group list-group-flush">
                            <li className='list-group-item' >
                                <strong style={{minWidth:'25%',float:'left'}} >Room</strong> : {selectedEvent?.room_id.room_name || 'N/A'}
                            </li>
                            <li className='list-group-item d-flex' >
                                <strong style={{minWidth:'25%',float:'left'}} >Location</strong> : <span className='ps-1'> {selectedEvent?.room_id.location || 'N/A'}</span>
                            </li>
                            <li className='list-group-item'>
                                <strong style={{minWidth:'25%',float:'left'}} >Start</strong> : {formatDate(selectedEvent?.start_time)}
                            </li>
                            <li className='list-group-item'>
                                <strong style={{minWidth:'25%',float:'left'}} >End</strong> : {formatDate(selectedEvent?.end_time)}
                            </li>
                            <li className='list-group-item'>
                                <strong style={{minWidth:'25%',float:'left'}} >Description</strong> : {selectedEvent?.purpose || 'N/A'}
                            </li>
                            <li className='list-group-item'>
                                <strong style={{minWidth:'25%',float:'left'}} >Created By</strong> : {selectedEvent?.user_id.name}  ({selectedEvent?.user_id.mobile_no})
                            </li>
                        </ul>
                        {/* <p><strong>Location:</strong> {selectedEvent?.room_id.room_name || 'N/A'}, {selectedEvent?.room_id.location || 'N/A'}</p>
                        <p><strong>Start:</strong> {formatDate(selectedEvent?.start_time)}</p>
                        <p><strong>End:</strong> {formatDate(selectedEvent?.end_time)}</p>
                        <p><strong>Description:</strong> {selectedEvent?.purpose || 'N/A'}</p>
                        <p><strong>Created By:</strong> {selectedEvent?.user_id.name}  ({selectedEvent?.user_id.mobile_no}) </p> */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}
export default MyCustomCalendar;