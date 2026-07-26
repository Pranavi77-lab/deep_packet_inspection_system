"""
Threat Detection Module
"""

def detect_threat(payload):

    if payload is None:
        return {
            "threat": "SAFE",
            "severity": "NONE",
            "payload_status": "No Payload"
        }

    payload = payload.lower()

    # SQL Injection
    if ("drop table" in payload or
        "union select" in payload or
        "' or '1'='1" in payload):

        return {
            "threat": "SQL Injection",
            "severity": "HIGH",
            "payload_status": "Readable"
        }

    # Cross Site Scripting
    if "<script>" in payload:

        return {
            "threat": "Cross Site Scripting (XSS)",
            "severity": "HIGH",
            "payload_status": "Readable"
        }

    # Directory Traversal
    if "../" in payload:

        return {
            "threat": "Directory Traversal",
            "severity": "MEDIUM",
            "payload_status": "Readable"
        }

    # Command Injection
    if ("cmd.exe" in payload or
        "/bin/sh" in payload):

        return {
            "threat": "Command Injection",
            "severity": "HIGH",
            "payload_status": "Readable"
        }

    return {
        "threat": "SAFE",
        "severity": "NONE",
        "payload_status": "Readable"
    }