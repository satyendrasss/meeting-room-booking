import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddEditEventCalendar() {
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


    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        start: new Date(),
        end: new Date(),
        description: '',
    });

    const handleSelectSlot = ({ start, end }) => {
        // Open modal to create a new event
        setFormData({
            title: '',
            start,
            end,
            description: '',
        });
        setIsEditing(false);
        setSelectedEvent(null);
        setShowModal(true);
    };

    const handleSelectEvent = (event) => {
        // Open modal to edit an existing event
        setFormData({
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end),
            description: event.description,
        });
        setSelectedEvent(event);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSaveEvent = () => {
        if (isEditing) {
            // Update the existing event
            setEvents(events.map(e =>
                e.id === selectedEvent.id
                    ? { ...e, ...formData }
                    : e
            ));
        } else {
            // Create a new event
            setEvents([
                ...events,
                {
                    ...formData,
                    id: events.length + 1, // Simple ID generation
                }
            ]);
        }
        setShowModal(false);
        setSelectedEvent(null);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <>
            <div style={{ height: '100vh' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    style={{ height: '100%' }}
                />

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditing ? 'Edit Event' : 'Create New Event'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formEventTitle">
                                <Form.Label>Event Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter event title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEventStart">
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="start"
                                    value={format(new Date(formData.start), "yyyy-MM-dd'T'HH:mm")}
                                    onChange={(e) => setFormData({ ...formData, start: new Date(e.target.value) })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEventEnd">
                                <Form.Label>End Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="end"
                                    value={format(new Date(formData.end), "yyyy-MM-dd'T'HH:mm")}
                                    onChange={(e) => setFormData({ ...formData, end: new Date(e.target.value) })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEventDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
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

export default AddEditEventCalendar;