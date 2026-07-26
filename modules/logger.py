"""
Logger Module
"""

import csv
import os
from datetime import datetime

LOG_FILE = "data/logs.csv"


def initialize_log():

    # Always create the file with a header if it doesn't exist
    if not os.path.isfile(LOG_FILE):

        with open(LOG_FILE, "w", newline="") as file:

            writer = csv.writer(file)

            writer.writerow([
                "Packet ID",
                "Timestamp",
                "Source IP",
                "Destination IP",
                "IP Version",
                "Protocol",
                "Source Port",
                "Destination Port",
                "Threat",
                "Severity",
                "Payload Status"
            ])

        print("Header created successfully.")


def log_packet(packet_info, threat_info, payload_status):

    initialize_log()

    packet_id = 1

    if os.path.isfile(LOG_FILE):

        with open(LOG_FILE, "r", newline="") as file:

            reader = list(csv.reader(file))

            if len(reader) > 1:
                packet_id = len(reader)

    with open(LOG_FILE, "a", newline="") as file:

        writer = csv.writer(file)

        writer.writerow([
            packet_id,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            packet_info["source_ip"],
            packet_info["destination_ip"],
            packet_info["ip_version"],
            packet_info["protocol"],
            packet_info["source_port"],
            packet_info["destination_port"],
            threat_info["threat"],
            threat_info["severity"],
            payload_status
        ])