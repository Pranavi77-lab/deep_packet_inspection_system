"""
Deep Packet Inspection for Network Security Enhancement

Main Application

Author: Pranavi Narreddy
"""

import config

from modules.packet_capture import start_capture
from modules.packet_analyzer import analyze_packet
from modules.payload_extractor import extract_payload
from modules.threat_detection import detect_threat
from modules.alert_manager import generate_alert
from modules.logger import initialize_log, log_packet


def process_packet(packet):

    # Analyze Packet
    packet_info = analyze_packet(packet)

    # Skip invalid packets
    if packet_info is None:
        return

    # Extract Payload
    payload, payload_status = extract_payload(packet)

    # Detect Threat
    threat_info = detect_threat(packet_info, payload)

    # Display Packet Information
    print("\n" + "=" * 60)
    print("Packet Information")
    print("=" * 60)

    print(f"Source IP        : {packet_info['source_ip']}")
    print(f"Destination IP   : {packet_info['destination_ip']}")
    print(f"IP Version       : {packet_info['ip_version']}")
    print(f"Protocol         : {packet_info['protocol']}")
    print(f"Source Port      : {packet_info['source_port']}")
    print(f"Destination Port : {packet_info['destination_port']}")

    # Display Payload
    print("\nPayload")
    print("-" * 40)
    print(f"Payload Status : {payload_status}")

    if payload_status == "Readable" and payload:
        print(payload[:300])

    # Display Threat Information
    print("\nThreat Detection")
    print("-" * 40)
    print(f"Threat   : {threat_info['threat']}")
    print(f"Severity : {threat_info['severity']}")

    # Generate Alert
    generate_alert(packet_info, threat_info)

    # Save Packet to CSV
    log_packet(
        packet_info,
        threat_info,
        payload_status
    )


def main():

    print("=" * 60)
    print(config.PROJECT_NAME)
    print("=" * 60)

    # Create CSV if it doesn't exist
    initialize_log()

    print("Starting Live Packet Capture...")
    print("Press Ctrl + C to stop.\n")

    try:
        # Start Live Packet Capture
        start_capture(process_packet)

    except KeyboardInterrupt:
        print("\nPacket capture stopped by user.")

    except Exception as e:
        print(f"\nError: {e}")


if __name__ == "__main__":
    main()