import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <>
            <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                <div className="position-sticky pt-3">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/dashboard">
                                <span data-feather="home"></span>
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/user">
                                <span data-feather="file"></span>
                                Users
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/room">
                                <span data-feather="shopping-cart"></span>
                                Rooms
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/booking">
                                <span data-feather="users"></span>
                                Bookings
                            </Link>
                        </li>
                        
                    </ul>

                    {/* <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                        <span>Saved reports</span>
                        <a className="link-secondary" href="#" aria-label="Add a new report">
                            <span data-feather="plus-circle"></span>
                        </a>
                    </h6>
                    <ul className="nav flex-column mb-2">
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <span data-feather="file-text"></span>
                                Current month
                            </a>
                        </li>
                    </ul> */}
                </div>
            </nav>
        </>
    )
}
export default Sidebar;