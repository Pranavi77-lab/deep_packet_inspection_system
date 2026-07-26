import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import "../styles/charts.css";

function TrafficChart({ stats }) {

    const data = [

        {
            name: "Packets",
            value: stats.total_packets
        },

        {
            name: "TCP",
            value: stats.tcp_packets
        },

        {
            name: "UDP",
            value: stats.udp_packets
        },

        {
            name: "Threats",
            value: stats.threat_packets
        }

    ];

    return (

        <div className="chart-box">

            <h2>Network Traffic</h2>

            <ResponsiveContainer width="100%" height={300}>

                <BarChart data={data}>

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="value"
                        fill="#3B82F6"
                        radius={[6,6,0,0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}

export default TrafficChart;