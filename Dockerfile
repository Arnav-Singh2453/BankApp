# Stage 1: Build using Java 23 & Maven
FROM maven:3.9.9-eclipse-temurin-23-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime Environment using Java 23 JRE
FROM eclipse-temurin:23-jre-alpine
WORKDIR /app

# Copy built artifact (.war or .jar) from stage 1
COPY --from=build /app/target/*.war app.war

EXPOSE 8080

# Run the WAR file directly with embedded Tomcat
ENTRYPOINT ["java", "-jar", "app.war"]