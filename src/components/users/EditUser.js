import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../layouts/Layout";
import { useEffect, useState } from "react";

function EditUser() {
    const params = useParams();  
    const infoId = params.id;
    const apiBaseUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate(); 
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const TOKEN = userInfo.token;
    const [errors, setErrors] = useState({});
    const [inputFormData, setInputFormData] = useState({
        name: "",
        email: "",
        mobile_no: "",
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
        if (!data.name || !data.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!data.email || !data.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Email is invalid';
        }

        if (!data.mobile_no || !data.mobile_no.toString().trim()) {
            errors.mobile_no = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(data.mobile_no)) {
            errors.mobile_no = 'Mobile number should be 10 digits';
        }
        return errors;
    };

    async function updateUser(e) {
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
                let res = await fetch(apiBaseUrl + "/user/"+infoId, {
                    method: "PUT",
                    body: JSON.stringify(inputFormData), 
                    headers: headers
                });
                let resJson = await res.json();
                if (resJson.status === true) {
                    navigate("/user");
                    return;
                } else {
                    console.log(resJson);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log('Form has validation errors.', errors);
        }
    }


    /// 
    const [allInfo, setAllInfo] = useState({});
    useEffect(() => {  
        const getInformation = async (infoId) => {
            try {
                let headers = new Headers();
                headers.append('Content-Type', 'application/json');
                headers.append('Accept', 'application/json');
                headers.append('authorization', 'Bearer ' + TOKEN);
                let res = await fetch(apiBaseUrl+"/user/info/" + infoId, {
                    method: "GET",
                    headers: headers
                });
                let resJson = await res.json();
                if (resJson.status) {
                    setInputFormData(resJson.result);
                    // setAllInfo(resJson.result);
                } else {
                    //
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        getInformation(infoId);
    }, []);

    return (
        <>
            <Layout>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h4">Add User </h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group me-2">
                            {/* <button type="button" className="btn btn-sm btn-outline-secondary">Users</button> */}
                            {/* <button type="button" className="btn btn-sm btn-outline-secondary">Export</button> */}
                        </div>

                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <form onSubmit={updateUser} >
                            <div className="row">
                                <div className="col-sm-6">
                                    <label className="form-label">Name *</label>
                                    <input type="text" name="name" value={inputFormData.name} onChange={handleInputChange} className="form-control" />
                                    {errors.name && <span className="text-danger">{errors.name}</span>}
                                </div>

                                <div className="col-sm-6">
                                    <label className="form-label">Email *</label>
                                    <input type="text" name="email" value={inputFormData.email} onChange={handleInputChange} className="form-control" />
                                    {errors.email && <span className="text-danger">{errors.email}</span>}
                                </div>

                                <div className="col-sm-6 mt-2">
                                    <label className="form-label">Mobile Number *</label>
                                    <input type="text" name="mobile_no" value={inputFormData.mobile_no} onChange={handleInputChange} className="form-control" />
                                    {errors.mobile_no && <span className="text-danger">{errors.mobile_no}</span>}
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

export default EditUser;