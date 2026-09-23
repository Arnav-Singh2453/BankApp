# Stage 1: Build using Java 23 & Maven
FROM maven:3.9.9-eclipse-temurin-23-alpine AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

# Build package and run Spring Boot repackage goal
RUN mvn clean package -DskipTests

# Stage 2: Runtime Environment using Java 23 JRE
FROM eclipse-temurin:23-jre-alpine
WORKDIR /app

# Copy executable archive from target/
COPY --from=build /app/target/app.* ./app.file

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.file"]