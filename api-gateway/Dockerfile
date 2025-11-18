FROM eclipse-temurin:23-jdk AS build
WORKDIR /workspace

COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn
COPY api-gateway api-gateway

RUN chmod +x mvnw && ./mvnw -f api-gateway/pom.xml -DskipTests package

FROM eclipse-temurin:23-jdk
WORKDIR /app

COPY --from=build /workspace/api-gateway/target/api-gateway-*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
