from scapy.layers.inet import IP, TCP, UDP
from scapy.layers.inet6 import IPv6


def analyze_packet(packet):

    packet_info = {
        "source_ip": "Unknown",
        "destination_ip": "Unknown",
        "ip_version": "Unknown",
        "protocol": "Unknown",
        "source_port": None,
        "destination_port": None
    }

    # IPv4
    if IP in packet:
        packet_info["source_ip"] = packet[IP].src
        packet_info["destination_ip"] = packet[IP].dst
        packet_info["ip_version"] = "IPv4"

    # IPv6
    elif IPv6 in packet:
        packet_info["source_ip"] = packet[IPv6].src
        packet_info["destination_ip"] = packet[IPv6].dst
        packet_info["ip_version"] = "IPv6"

    # TCP
    if TCP in packet:
        packet_info["protocol"] = "TCP"
        packet_info["source_port"] = packet[TCP].sport
        packet_info["destination_port"] = packet[TCP].dport

    # UDP
    elif UDP in packet:
        packet_info["protocol"] = "UDP"
        packet_info["source_port"] = packet[UDP].sport
        packet_info["destination_port"] = packet[UDP].dport

    return packet_info