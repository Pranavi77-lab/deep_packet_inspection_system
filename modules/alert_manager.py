"""
Alert Manager Module
"""

from datetime import datetime

# Dictionary to store alert counts
alerts = {}


def generate_alert(packet_info, threat_info):

    # Do not alert for safe packets
    if threat_info["threat"] == "SAFE":
        return

    key = (
        packet_info["source_ip"],
        threat_info["threat"]
    )

    if key not in alerts:

        alerts[key] = 1

    else:

        alerts[key] += 1

    print("\n" + "=" * 60)
    print("🚨 SECURITY ALERT")
    print("=" * 60)

    print(f"Time       : {datetime.now().strftime('%H:%M:%S')}")
    print(f"Source IP  : {packet_info['source_ip']}")
    print(f"Threat     : {threat_info['threat']}")
    print(f"Severity   : {threat_info['severity']}")
    print(f"Occurrences: {alerts[key]}")

    print("=" * 60)