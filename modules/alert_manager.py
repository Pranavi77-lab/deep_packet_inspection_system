"""
Alert Manager Module
"""

import json
import os
from datetime import datetime

ALERT_FILE = "data/alerts.json"


def generate_alert(packet_info, threat_info):

    # Safe packets don't create alerts
    if threat_info["threat"] == "SAFE":
        return

    alert = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "source_ip": packet_info["source_ip"],
        "destination_ip": packet_info["destination_ip"],
        "protocol": packet_info["protocol"],
        "source_port": packet_info["source_port"],
        "destination_port": packet_info["destination_port"],
        "threat": threat_info["threat"],
        "severity": threat_info["severity"]
    }

    alerts = []
  

    if os.path.exists(ALERT_FILE):
        try:
            with open(ALERT_FILE, "r") as f:
                alerts = json.load(f)
        except:
            alerts = []

    alerts.insert(0, alert)

    # Keep only latest 50 alerts
    alerts = alerts[:50]

    with open(ALERT_FILE, "w") as f: 
        json.dump(alerts, f, indent=4)

    print("\n🚨 ALERT GENERATED 🚨")
    print("Threat :", threat_info["threat"])
    print("Severity :", threat_info["severity"])