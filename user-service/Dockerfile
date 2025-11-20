FROM eclipse-temurin:23-jdk AS build
WORKDIR /workspace

COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn
COPY user-service user-service

RUN chmod +x mvnw && ./mvnw -f user-service/pom.xml clean package -DskipTests

FROM eclipse-temurin:23-jdk
WORKDIR /app

COPY --from=build /workspace/user-service/target/user-service-*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java","-jar","app.jar"]
