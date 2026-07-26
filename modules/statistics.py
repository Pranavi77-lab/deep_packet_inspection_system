"""
Statistics Module
"""

class Statistics:

    def __init__(self):

        self.total_packets = 0
        self.tcp_packets = 0
        self.udp_packets = 0
        self.ipv4_packets = 0
        self.ipv6_packets = 0
        self.payload_packets = 0
        self.encrypted_packets = 0
        self.threat_packets = 0
        self.safe_packets = 0

    def show_statistics(self):

        print("\n")
        print("=" * 50)
        print("Current Statistics")
        print("=" * 50)

        print(f"Total Packets : {self.total_packets}")
        print(f"TCP Packets   : {self.tcp_packets}")
        print(f"UDP Packets   : {self.udp_packets}")
        print(f"IPv4 Packets  : {self.ipv4_packets}")
        print(f"IPv6 Packets  : {self.ipv6_packets}")

        print("=" * 50)