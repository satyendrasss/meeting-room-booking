import { Link } from "react-router-dom";
import Layout from "../../layouts/Layout"
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

function User() {
    const apiBaseUrl = process.env.REACT_APP_API_URL;
    const [datas, setDatas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const TOKEN = userInfo?.token;

    useEffect(() => {
        getAllData();
    }, [])

    const getAllData = async () => {
        try {
            const url = apiBaseUrl + `/user?page=${currentPage}&limit=${itemsPerPage}`;
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            headers.append('authorization', 'Bearer ' + TOKEN);
            const response = await fetch(url, {
                method: "GET",
                headers: headers
            });
            const res = await response.json();
            setDatas(res.result);
            // setTotalRecords(res.totalItems);
        } catch (error) {
            console.error('Error fetching users:', error);
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

    /// DELETE RECORDS
    const deleteConfirmation = (uniqId) => {
        Swal.fire({
            // title: "Are you sure?",
            width: "350",
            height: "300",
            text: "You want to be delete this?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                recordDelete(uniqId);
            }
        });
    };

    const recordDelete = async (uniqId) => {
        try {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            headers.append('authorization', 'Bearer ' + TOKEN);
            let res = await fetch(apiBaseUrl + "/user/" + uniqId, {
                method: "DELETE",
                headers: headers
            });
            let resJson = await res.json();
            if (resJson.status === true) {
                Toast.fire({
                    icon: 'success',
                    title: 'Deleted',
                });
                getAllData();
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Something went wrong',
                })
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }


    return (
        <>
            <Layout>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 className="h4">User List  </h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group me-2">
                            <Link type="button" className="btn btn-sm btn-outline-secondary" to={`/add-user`}>Add New</Link>
                            {/* <button type="button" className="btn btn-sm btn-outline-secondary">Export</button> */}
                        </div>

                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th scope="col">#SN</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Mobile Number</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datas?.map((data, index) => (
                                <tr key={index}>
                                    <td>{index + ((currentPage - 1) * itemsPerPage) + 1}</td>
                                    <td>{data.name}</td>
                                    <td>{data.email}</td>
                                    <td>{data.mobile_no}</td>
                                    <td>
                                        <Link className='btn btn-sm btn-outline-info' to={`/edit-user/${data._id}`} ><i className="fa fa-pencil"></i></Link>
                                        <Link className='ms-1 btn btn-sm btn-outline-danger' onClick={() => deleteConfirmation(data._id)} title="Delete">
                                            <i className="fa fa-trash"></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </Layout>
        </>
    )
}

export default User;