"""
Packet Capture Module
"""

from scapy.all import sniff


def start_capture(packet_callback):

    print("Starting Live Packet Capture...")
    print("Press Ctrl + C to stop.\n")

    sniff(
        prn=packet_callback,
        store=False
    )