import "../styles/cards.css";

function StatsCards({ stats }) {

    return (

        <div className="cards-container">

            <div className="card">
                <h3>Total Packets</h3>
                <h1>{stats.total_packets}</h1>
            </div>

            <div className="card">
                <h3>TCP Packets</h3>
                <h1>{stats.tcp_packets}</h1>
            </div>

            <div className="card">
                <h3>UDP Packets</h3>
                <h1>{stats.udp_packets}</h1>
            </div>

            <div className="card">
                <h3>Threat Packets</h3>
                <h1>{stats.threat_packets}</h1>
            </div>

        </div>

    );

}

export default StatsCards;