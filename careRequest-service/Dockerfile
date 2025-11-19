FROM eclipse-temurin:23-jdk AS build
WORKDIR /workspace

COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn
COPY careRequest-service careRequest-service

RUN chmod +x mvnw && ./mvnw -f careRequest-service/pom.xml -DskipTests package

FROM eclipse-temurin:23-jdk
WORKDIR /app

COPY --from=build /workspace/careRequest-service/target/careRequest-service-*.jar app.jar

EXPOSE 8083
ENTRYPOINT ["java","-jar","app.jar"]
