"""
Threat Detection Module
"""

# Suspicious ports and their descriptions
SUSPICIOUS_PORTS = {
    21: ("FTP Traffic", "MEDIUM"),
    23: ("Telnet Traffic", "HIGH"),
    135: ("RPC Service", "MEDIUM"),
    137: ("NetBIOS Name Service", "MEDIUM"),
    138: ("NetBIOS Datagram", "MEDIUM"),
    139: ("NetBIOS Session", "HIGH"),
    445: ("SMB Traffic", "HIGH"),
    3389: ("Remote Desktop (RDP)", "HIGH"),
}

# Suspicious keywords inside payload
SUSPICIOUS_KEYWORDS = [
    "attack",
    "malware",
    "virus",
    "exploit",
    "hack",
    "trojan",
    "payload",
    "shell",
    "cmd.exe",
    "powershell",
]


def detect_threat(packet_info, payload=""):

    # -----------------------------
    # Get ports safely
    # -----------------------------
    src_port = packet_info.get("source_port")
    dst_port = packet_info.get("destination_port")

    try:
        src_port = int(src_port)
    except (TypeError, ValueError):
        src_port = 0

    try:
        dst_port = int(dst_port)
    except (TypeError, ValueError):
        dst_port = 0

    payload = str(payload).lower()

    # -----------------------------
    # Rule 1 : Suspicious Destination Port
    # -----------------------------
    if dst_port in SUSPICIOUS_PORTS:

        threat, severity = SUSPICIOUS_PORTS[dst_port]

        return {
            "threat": threat,
            "severity": severity
        }

    # -----------------------------
    # Rule 2 : Suspicious Source Port
    # -----------------------------
    if src_port in SUSPICIOUS_PORTS:

        threat, severity = SUSPICIOUS_PORTS[src_port]

        return {
            "threat": threat,
            "severity": severity
        }

    # -----------------------------
    # Rule 3 : Payload Keyword Detection
    # -----------------------------
    for word in SUSPICIOUS_KEYWORDS:

        if word in payload:

            return {
                "threat": f"Suspicious Payload ({word})",
                "severity": "HIGH"
            }

    # -----------------------------
    # Rule 4 : Large Payload
    # -----------------------------
    if len(payload) > 1500:

        return {
            "threat": "Large Payload",
            "severity": "MEDIUM"
        }

    # -----------------------------
    # Rule 5 : Unknown Dynamic Ports
    # -----------------------------
    if dst_port > 49152:

        return {
            "threat": "Dynamic/Unknown Port",
            "severity": "LOW"
        }

    # -----------------------------
    # Safe Packet
    # -----------------------------
    return {
        "threat": "SAFE",
        "severity": "NONE"
    }