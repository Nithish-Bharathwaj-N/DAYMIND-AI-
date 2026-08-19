# How to Run DayMind AI

This directory contains the complete source code, backend services, frontend user interface, and automatic launchers for **DayMind AI — Personal Productivity Operating System**.

---

## ⚡ Method 1: Automatic 1-Click Script (Recommended)

Run the included `./start.sh` launcher script from terminal. It automatically configures Java 21 environment, starts the Spring Boot backend on port `8080`, and launches the Vite React frontend on port `5173`.

```bash
./start.sh
```

Then open your browser to: **[http://localhost:5173](http://localhost:5173)**

---

## 🛠️ Method 2: Manual Terminal Startup

If you prefer to start each service manually in separate terminals:

### **Terminal 1: Java Spring Boot Backend**
```bash
cd backend
mvn spring-boot:run
```
> **Backend URL**: `http://localhost:8080`  
> **Database Console**: `http://localhost:8080/h2-console`

### **Terminal 2: React Vite Frontend**
```bash
cd frontend
npm install
npm run dev
```
> **Frontend URL**: `http://localhost:5173`

---

## 🐳 Method 3: 1-Click Docker Container

To run the entire multi-stage build (Java 21 + React) inside Docker:

```bash
# Build container image
docker build -t daymind-ai .

# Run container on port 8080
docker run -p 8080:8080 daymind-ai
```
> Access at: **[http://localhost:8080](http://localhost:8080)**

---

## 📦 Method 4: Production Executable Binary (JAR)

```bash
# Build static React frontend
cd frontend
npm run build

# Build Java executable JAR
cd ../backend
mvn clean package -DskipTests

# Run Standalone Production Application
java -jar target/daymind-backend-1.0.0.jar
```

---

## ⚙️ Requirements & System Info

- **Java Version**: Java 21 JDK (or Java 17+)
- **Build Tools**: Maven (`mvn`), Node.js (v18+), npm
- **Database**: Embedded persistent H2 database (`./data/dayminddb`) & PostgreSQL support
- **AI Model Engine**: Google Gemini API (`gemini-flash-latest`)
