#!/usr/bin/env bash
# ==============================================================================
# DayMind AI — Automatic Launcher Script
# Starts Java Spring Boot Backend & React Vite Frontend in parallel
# ==============================================================================

set -e

# Setup Java 21 environment if installed locally
if [ -d "/home/nixarch/.local/java/jdk-21.0.2+13" ]; then
    export JAVA_HOME="/home/nixarch/.local/java/jdk-21.0.2+13"
    export PATH="$JAVA_HOME/bin:/home/nixarch/.local/bin:$PATH"
fi

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo "=========================================================="
echo "🚀 Launching DayMind AI Personal Productivity Operating System"
echo "=========================================================="
echo "📁 Project Directory: $PROJECT_DIR"

# 1. Start Spring Boot Backend
echo ""
echo "⚙️ Starting Java Spring Boot Backend on http://localhost:8080..."
cd "$BACKEND_DIR"
if command -v mvn &> /dev/null; then
    mvn spring-boot:run &
    BACKEND_PID=$!
elif [ -f "./mvnw" ]; then
    ./mvnw spring-boot:run &
    BACKEND_PID=$!
else
    echo "❌ Error: Maven (mvn) or ./mvnw not found. Please install Maven."
    exit 1
fi

# Cleanup on Ctrl+C
trap 'echo -e "\n🛑 Stopping DayMind AI processes..."; kill $BACKEND_PID 2>/dev/null; exit 0' INT TERM EXIT

# Wait 3 seconds for backend initialization
sleep 3

# 2. Start React Frontend
echo ""
echo "🎨 Starting React Vite Frontend on http://localhost:5173..."
cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node dependencies..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!

echo ""
echo "=========================================================="
echo "✅ DayMind AI is running!"
echo "   • App UI:   http://localhost:5173"
echo "   • Backend:  http://localhost:8080"
echo "   • H2 DB:    http://localhost:8080/h2-console"
echo "=========================================================="
echo "Press Ctrl+C to stop all services."

# Wait for background processes
wait
