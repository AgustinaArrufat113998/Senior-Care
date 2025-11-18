FROM eclipse-temurin:23-jdk AS build
WORKDIR /workspace

COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn
COPY auth-service auth-service

RUN chmod +x mvnw && ./mvnw -f auth-service/pom.xml -DskipTests package

FROM eclipse-temurin:23-jdk
WORKDIR /app

COPY --from=build /workspace/auth-service/target/auth-service-*.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java","-jar","app.jar"]
