# =========================================================
# Stage 1: Build React Frontend
# =========================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# =========================================================
# Stage 2: Build Java Spring Boot Backend
# =========================================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn package -DskipTests

# =========================================================
# Stage 3: Production Runtime Environment
# =========================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy compiled jar
COPY --from=backend-builder /app/backend/target/daymind-backend-1.0.0.jar app.jar

# Expose port
EXPOSE 8080

# Environment variables
ENV PORT=8080
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Launch Spring Boot OS
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
