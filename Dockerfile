# Stage 1: Build using Java 23 & Maven
FROM maven:3.9.9-eclipse-temurin-23-alpine AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Stage 2: Runtime Environment using Java 23 JRE
FROM eclipse-temurin:23-jre-alpine
WORKDIR /app

# Explicitly copy app.war (or app.jar depending on your <packaging> setting)
COPY --from=build /app/target/app.war ./app.war

EXPOSE 8080

# Pass --enable-preview if your code uses Java 23 preview features at runtime
ENTRYPOINT ["java", "--enable-preview", "-jar", "app.war"]