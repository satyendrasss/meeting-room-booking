import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

function CalendarHelper() {
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
    // const events = [
    //     {
    //         title: 'Meeting',
    //         start: new Date(),
    //         end: new Date(new Date().getTime() + 60 * 60 * 1000),
    //     },
    //     {
    //         title: 'Lunch',
    //         start: new Date(new Date().setHours(12, 0, 0)),
    //         end: new Date(new Date().setHours(13, 0, 0)),
    //     },
    // ];
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'Meeting with Team',
            start: new Date(),
            end: new Date(new Date().getTime() + 60 * 60 * 1000),
            description: 'Discuss project progress and next steps.',
        }
    ]);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: new Date(),
        end: new Date(),
    });
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleSelectSlot = ({ start, end }) => {
        setSelectedSlot({ start, end });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveEvent = () => {
        setEvents([...events, { ...newEvent, start: selectedSlot.start, end: selectedSlot.end }]);
        setShowModal(false);
        setNewEvent({ title: '', start: new Date(), end: new Date() });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    return (
        <>
            <div style={{ height: '70vh' }} className='mt-2'>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    onSelectSlot={handleSelectSlot}
                    style={{ height: '100%' }}
                />


                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Event</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formEventTitle">
                                <Form.Label>Event Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter event title"
                                    name="title"
                                    value={newEvent.title}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEventStart">
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="start"
                                    value={format(newEvent.start, "yyyy-MM-dd'T'HH:mm")}
                                    onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEventEnd">
                                <Form.Label>End Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="end"
                                    value={format(newEvent.end, "yyyy-MM-dd'T'HH:mm")}
                                    onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveEvent}>
                            Save Event
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </>
    )
}

export default CalendarHelper;