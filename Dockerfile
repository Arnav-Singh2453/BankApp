# Stage 1: Build using Java 23 & Maven
FROM maven:3.9.9-eclipse-temurin-23-alpine AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

# Build package without running tests
RUN mvn clean package -DskipTests

# Stage 2: Runtime Environment using Java 23 JRE
FROM eclipse-temurin:23-jre-alpine
WORKDIR /app

# Copy the exact output file generated in target/
COPY --from=build /app/target/app.* ./app.file

EXPOSE 8080

# Launch the executable package
ENTRYPOINT ["java", "-jar", "app.file"]