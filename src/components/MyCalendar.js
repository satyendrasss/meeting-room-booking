import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


// This calendar only for view event details 

function MyCalendar() {
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
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'Meeting with Team',
            start: new Date(),
            end: new Date(new Date().getTime() + 60 * 60 * 1000),
            description: 'Discuss project progress and next steps.',
        },
        {
            id: 2,
            title: 'Lunch with Client',
            start: new Date(new Date().setHours(12, 0, 0)),
            end: new Date(new Date().setHours(13, 0, 0)),
            description: 'Lunch at the new cafe downtown.',
        },
    ]);

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
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    onSelectEvent={handleSelectEvent}
                    style={{ height: '100%' }}
                />

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedEvent ? selectedEvent.title : ''}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Start:</strong> {formatDate(selectedEvent?.start)}</p>
                        <p><strong>End:</strong> {formatDate(selectedEvent?.end)}</p>
                        <p><strong>Description:</strong> {selectedEvent?.description || 'N/A'}</p>
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
export default MyCalendar;