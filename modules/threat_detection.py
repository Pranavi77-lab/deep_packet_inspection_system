# modules/threat_detection.py

import re

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

# Keywords that may indicate suspicious payloads
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

    src_port = packet_info.get("source_port", 0)
    dst_port = packet_info.get("destination_port", 0)

    payload = str(payload).lower()

    # -------------------------------------------------------
    # Rule 1 : Suspicious destination ports
    # -------------------------------------------------------
    if dst_port in SUSPICIOUS_PORTS:
        threat, severity = SUSPICIOUS_PORTS[dst_port]
        return {
            "threat": threat,
            "severity": severity
        }

    # -------------------------------------------------------
    # Rule 2 : Suspicious source ports
    # -------------------------------------------------------
    if src_port in SUSPICIOUS_PORTS:
        threat, severity = SUSPICIOUS_PORTS[src_port]
        return {
            "threat": threat,
            "severity": severity
        }

    # -------------------------------------------------------
    # Rule 3 : Payload keyword detection
    # -------------------------------------------------------
    for word in SUSPICIOUS_KEYWORDS:
        if word in payload:
            return {
                "threat": f"Suspicious Payload ({word})",
                "severity": "HIGH"
            }

    # -------------------------------------------------------
    # Rule 4 : Large payload detection
    # -------------------------------------------------------
    if len(payload) > 1500:
        return {
            "threat": "Large Payload",
            "severity": "MEDIUM"
        }

    # -------------------------------------------------------
    # Rule 5 : Unknown high-numbered ports
    # -------------------------------------------------------
    if dst_port > 49152:
        return {
            "threat": "Dynamic/Unknown Port",
            "severity": "LOW"
        }

    # -------------------------------------------------------
    # Safe packet
    # -------------------------------------------------------
    return {
        "threat": "SAFE",
        "severity": "NONE"
    }