#!/bin/bash

# Installation script for yt-dlp CLI tool on macOS
# Date: 2025-11-16

echo "Installing yt-dlp CLI tool..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if pip3 is installed
if ! command -v pip3 &> /dev/null; then
    echo "Error: pip3 is not installed. Please install pip3 first."
    exit 1
fi

# Install yt-dlp using pip3
pip3 install yt-dlp

# Verify installation
if command -v yt-dlp &> /dev/null; then
    echo "yt-dlp installed successfully!"
    echo "Version: $(yt-dlp --version)"
else
    echo "Installation failed. Please check errors above."
    exit 1
fi

echo ""
echo "Usage examples:"
echo "  yt-dlp [URL]                          - Download video"
echo "  yt-dlp -x --audio-format mp3 [URL]   - Download audio only as MP3"
echo "  yt-dlp -F [URL]                       - List available formats"
echo "  yt-dlp --help                         - Show all options"
