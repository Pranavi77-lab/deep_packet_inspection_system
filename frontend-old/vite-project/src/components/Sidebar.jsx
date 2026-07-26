import "../styles/sidebar.css";

function Sidebar() {

    return (

        <aside className="sidebar">

            <h2 className="sidebar-title">
                Menu
            </h2>

            <ul className="sidebar-menu">

                <li className="active">
                    Dashboard
                </li>

                <li>
                    Packet Logs
                </li>

                <li>
                    Threat Analysis
                </li>

                <li>
                    Settings
                </li>

            </ul>

        </aside>

    );

}

export default Sidebar;