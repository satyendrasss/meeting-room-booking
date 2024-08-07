import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import { useState } from "react";

function AddRoom() {
    const apiBaseUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const TOKEN = userInfo.token;
    const [errors, setErrors] = useState({}); 
    const [inputFormData, setInputFormData] = useState({
        room_name: "",
        capacity: "",
        location: ""
    });
    
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
        if (!data.room_name || !data.room_name.trim()) {
            errors.room_name = 'Name is required';
        }
        if (!data.location || !data.location.trim()) {
            errors.location = 'Location is required';
        }
        return errors;
    };

    async function saveRoom(e) {
        e.preventDefault();
        console.log('form submitted')
        const validationErrors = validateForm(inputFormData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            
            console.log('Form submitted:', inputFormData);
            try {
                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                headers.append('Accept', 'application/json');
                headers.append('authorization', 'Bearer ' + TOKEN);
                let res = await fetch(apiBaseUrl + "/room", {
                    method: "POST",
                    body: JSON.stringify(inputFormData),
                    headers: headers
                });
                let resJson = await res.json();
                if (resJson.status===true) {
                    navigate("/room");
                    return;
                }else{
                    console.log(resJson);
                }
            }catch(err){
                console.log(err);
            }
        } else {
            console.log('Form has validation errors.',errors);
        }
    }

    return (
        <>
            <Layout>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h4">Add Room </h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group me-2">

                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <form onSubmit={saveRoom}>
                            <div className="row">
                                <div className="col-sm-6">
                                    <label className="form-label">Room Name *</label>
                                    <input type="text" name="room_name" value={inputFormData.room_name} onChange={handleInputChange} className="form-control" />
                                    {errors.room_name && <span className="text-danger">{errors.room_name}</span>}
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label">Capacity </label>
                                    <input type="number" min={1} name="capacity" value={inputFormData.capacity} onChange={handleInputChange} className="form-control" />
                                </div>

                                <div className="col-sm-12 mt-2">
                                    <label className="form-label">Location *</label>
                                    <input type="text" name="location" value={inputFormData.location} onChange={handleInputChange} className="form-control" />
                                    {errors.location && <span className="text-danger">{errors.location}</span>}
                                </div>

                                <div className="col-sm-12 mt-2">
                                    <button type="submit" className="btn btn-sm btn-outline-secondary float-end">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default AddRoom;