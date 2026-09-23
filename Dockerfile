# Stage 1: Build the Application using Maven & Java 23
FROM maven:3.9.9-eclipse-temurin-23-alpine AS build
WORKDIR /app

# Copy pom.xml and source code into container
COPY pom.xml .
COPY src ./src

# Build executable JAR file and skip tests
RUN mvn clean package -DskipTests

# Stage 2: Run the Application using Java 23 JRE
FROM eclipse-temurin:23-jre-alpine
WORKDIR /app

# Copy the generated JAR file from Stage 1
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Command to start the application
ENTRYPOINT ["java", "-jar", "app.jar"]