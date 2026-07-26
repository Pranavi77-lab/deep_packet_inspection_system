"""
Payload Extractor Module
"""

from scapy.packet import Raw


def extract_payload(packet):

    if Raw not in packet:
        return None, "No Payload"

    try:

        payload = packet[Raw].load.decode("utf-8")

        if payload.strip() == "":
            return None, "Empty Payload"

        return payload, "Readable"

    except UnicodeDecodeError:

        return None, "Encrypted"

    except Exception:

        return None, "Unknown"