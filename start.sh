#!/bin/bash

# Detect local IP address
INTERFACE=$(route get default | grep interface | awk '{print $2}')
LOCAL_IP=$(ipconfig getifaddr $INTERFACE)

if [ -z "$LOCAL_IP" ]; then
    export PUBLIC_URL="http://localhost:3000"
else
    export PUBLIC_URL="http://$LOCAL_IP:3000"
fi

case "$1" in
    start)
        echo "✅ Detected local IP: $LOCAL_IP"
        echo "🚀 Starting Photocard Studio & Cloudflare Tunnel (Daemon)"
        echo "🌍 Local: $PUBLIC_URL"
        docker-compose up -d --build
        ;;
    stop)
        echo "🛑 Stopping Photocard Studio & Tunnel..."
        docker-compose down
        ;;
    restart)
        bash "$0" stop
        bash "$0" start
        ;;
    logs)
        docker-compose logs -f
        ;;
    *)
        echo "✅ Detected local IP: $LOCAL_IP"
        echo "🚀 Starting Photocard Studio & Cloudflare Tunnel (Foreground)"
        echo "🌍 Local: $PUBLIC_URL"
        echo "Usage: ./start.sh [start|stop|restart|logs]"
        echo "------------------------------------------------"
        docker-compose up --build
        ;;
esac
