import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout({children}) {
    return (
        <>
            <Header />
            <div className="container-fluid">
                <div className="row">
                    <Sidebar/>
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        {children}
                                               
                    </main>
                </div>
            </div>
        </>
    )
}

export default Layout;