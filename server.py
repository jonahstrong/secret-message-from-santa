#!/usr/bin/env python3
"""
Simple HTTP Server for Secret Message from Santa
Serves the application on localhost:8000
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Configuration
PORT = 8000
HOST = "localhost"

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler with proper MIME types for web assets"""

    def end_headers(self):
        # Enable CORS for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom log format
        print(f"[{self.log_date_time_string()}] {format % args}")


def main():
    # Change to the directory where the script is located
    script_dir = Path(__file__).parent
    os.chdir(script_dir)

    # Create the server
    with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
        url = f"http://{HOST}:{PORT}"

        print("=" * 60)
        print("🎅 Secret Message from Santa - HTTP Server")
        print("=" * 60)
        print(f"Server started at: {url}")
        print(f"Serving directory: {script_dir}")
        print("\nPress Ctrl+C to stop the server")
        print("=" * 60)

        # Optionally open browser automatically (uncomment if desired)
        # webbrowser.open(url)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped")
            print("=" * 60)


if __name__ == "__main__":
    main()
