import "../styles/navbar.css";

function Navbar() {
    return (
        <nav className="navbar">

            <div className="navbar-title">
                Deep Packet Inspection System
            </div>

            <div className="navbar-status">

                <span className="status-dot"></span>

                <span>LIVE MONITORING</span>

            </div>

        </nav>
    );
}

export default Navbar;