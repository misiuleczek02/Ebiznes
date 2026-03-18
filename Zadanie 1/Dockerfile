FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y software-properties-common wget curl unzip

RUN add-apt-repository ppa:deadsnakes/ppa -y && \
    apt-get update && \
    apt-get install -y python3.10

RUN apt-get install -y openjdk-8-jdk kotlin

ENV GRADLE_VERSION=8.6
RUN wget https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -P /tmp && \
    unzip -d /opt/gradle /tmp/gradle-${GRADLE_VERSION}-bin.zip && \
    ln -s /opt/gradle/gradle-${GRADLE_VERSION}/bin/gradle /usr/bin/gradle && \
    rm /tmp/gradle-${GRADLE_VERSION}-bin.zip

WORKDIR /app

COPY . /app/

RUN gradle build --no-daemon

CMD ["gradle", "run", "--no-daemon"]