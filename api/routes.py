from flask import Blueprint, jsonify
import pandas as pd
import os
import json

api = Blueprint("api", __name__)


@api.route("/stats")
def get_stats():

    df = pd.read_csv("data/logs.csv")

    stats = {
        "total_packets": len(df),
        "tcp_packets": len(df[df["Protocol"] == "TCP"]),
        "udp_packets": len(df[df["Protocol"] == "UDP"]),
        "ipv4_packets": len(df[df["IP Version"] == "IPv4"]),
        "ipv6_packets": len(df[df["IP Version"] == "IPv6"]),
        "safe_packets": len(df[df["Threat"] == "SAFE"]),
        "threat_packets": len(df[df["Threat"] != "SAFE"])
    }

    return jsonify(stats)


@api.route("/packets")
def get_packets():

    df = pd.read_csv("data/logs.csv")

    return jsonify(df.tail(50).to_dict(orient="records"))
@api.route("/alerts")
def get_alerts():

    alert_file = "data/alerts.json"

    if not os.path.exists(alert_file):
        return jsonify([])

    try:
        with open(alert_file, "r") as f:
            alerts = json.load(f)

        return jsonify(alerts)

    except Exception:
        return jsonify([])