import { useEffect, useState } from "react";
import api from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatsCards from "../components/StatsCards";
import TrafficChart from "../components/TrafficChart";
import PacketTable from "../components/PacketTable";

import "../styles/dashboard.css";

function Dashboard() {

    const [stats, setStats] = useState({
        total_packets: 0,
        tcp_packets: 0,
        udp_packets: 0,
        threat_packets: 0,
        ipv4_packets: 0,
        ipv6_packets: 0,
        safe_packets: 0
    });

    useEffect(() => {

        async function fetchStats() {

            try {

                const response = await api.get("/stats");

                setStats(response.data);

            } catch (error) {

                console.error(error);

            }

        }

        fetchStats();

    }, []);

    return (

        <div className="dashboard-container">

            <Navbar />

            <div className="dashboard-body">

                <Sidebar />

                <main className="dashboard-content">

                    <h1>Dashboard</h1>

                    <p>
                        Welcome to the Deep Packet Inspection System.
                    </p>

                    <StatsCards stats={stats} />

                    <TrafficChart stats={stats} />
<PacketTable />
                </main>

            </div>

        </div>

    );

}

export default Dashboard;