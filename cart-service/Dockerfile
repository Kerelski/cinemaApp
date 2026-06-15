FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

COPY pom.xml ./
COPY cart-service/pom.xml cart-service/pom.xml
COPY movie-service/pom.xml movie-service/pom.xml
COPY reservation-service/pom.xml reservation-service/pom.xml
COPY user-service/pom.xml user-service/pom.xml
RUN mvn -q -pl cart-service -am -DskipTests dependency:go-offline

COPY cart-service/src/ cart-service/src/
RUN mvn -q -pl cart-service -am -DskipTests package

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /app/cart-service/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
