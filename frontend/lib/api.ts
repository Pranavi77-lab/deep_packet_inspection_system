import axios from 'axios'

// Base URL of the already-running DPI backend.
// Override with NEXT_PUBLIC_DPI_API_URL if the backend runs elsewhere.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_DPI_API_URL ?? 'http://127.0.0.1:5000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
})

export interface Stats {
  total_packets: number
  tcp_packets: number
  udp_packets: number
  ipv4_packets: number
  ipv6_packets: number
  safe_packets: number
  threat_packets: number
}

export interface Packet {
  'Packet ID': number
  Timestamp: string
  'Source IP': string
  'Destination IP': string
  'IP Version': string
  Protocol: string
  'Source Port': number
  'Destination Port': number
  Threat: string
  Severity: string
  'Payload Status': string
}
export interface Alert {
  timestamp: string
  source_ip: string
  destination_ip: string
  protocol: string
  source_port: number
  destination_port: number
  threat: string
  severity: string
}
export const EMPTY_STATS: Stats = {
  total_packets: 0,
  tcp_packets: 0,
  udp_packets: 0,
  ipv4_packets: 0,
  ipv6_packets: 0,
  safe_packets: 0,
  threat_packets: 0,
}

export async function fetchStats(signal?: AbortSignal): Promise<Stats> {
  const { data } = await api.get<Stats>('/stats', { signal })
  return data
}

export async function fetchPackets(signal?: AbortSignal): Promise<Packet[]> {
  const { data } = await api.get<Packet[]>('/packets', { signal })
  return Array.isArray(data) ? data : []
}
export async function fetchAlerts(
  signal?: AbortSignal,
): Promise<Alert[]> {

  const { data } = await api.get<Alert[]>('/alerts', {
    signal,
  })

  return Array.isArray(data) ? data : []

}