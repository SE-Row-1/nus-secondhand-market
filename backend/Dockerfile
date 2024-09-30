FROM openjdk:17-jdk-alpine

WORKDIR /backend

COPY ./target/market-0.0.1-SNAPSHOT.jar /backend/market-0.0.1-SNAPSHOT.jar

EXPOSE 8080

ENV SERVER_PORT=8081

ENTRYPOINT ["java", "-jar", "/backend/market-0.0.1-SNAPSHOT.jar", "--server.port=8081"]
