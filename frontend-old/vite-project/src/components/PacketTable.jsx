import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/table.css";

function PacketTable() {

    const [packets, setPackets] = useState([]);

    useEffect(() => {

        async function fetchPackets() {

            try {

                const response = await api.get("/packets");

                setPackets(response.data);

            }

            catch(error){

                console.error(error);

            }

        }

        fetchPackets();

    }, []);

    return (

        <div className="table-container">

            <h2>Recent Packet Logs</h2>

            <table>

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Source</th>

                        <th>Destination</th>

                        <th>Protocol</th>

                        <th>Threat</th>

                    </tr>

                </thead>

                <tbody>

                    {packets.map((packet,index)=>(

                        <tr key={index}>

                            <td>{packet["Packet ID"]}</td>

                            <td>{packet["Source IP"]}</td>

                            <td>{packet["Destination IP"]}</td>

                            <td>{packet["Protocol"]}</td>

                            <td>{packet["Threat"]}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default PacketTable;