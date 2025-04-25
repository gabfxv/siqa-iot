# SIQA

**SIQA** (Intelligent Air Quality System) was developed in 2025 for the course `SSC5972 - Internet of Things` at the University of São Paulo.

The goal of SIQA is to put into practice the knowledge acquired during the course by developing a project that enables remote monitoring and control of air quality metrics in a laboratory environment.

The measurements obtained from sensors are:

- _Humidity_
- _Temperature_
- _CO2_
- _VOC_

## Getting started

### Install Docker
[Click to install Docker](https://www.docker.com/)

### Install the project
Clone the project and build via Docker Compose
``` 
git clone https://github.com/gabfxv/python-server-iot
cd python-server-iot
docker-compose up --build --scale server=<number_of_replications> -d
```

## Technologies
- [Python 3.13](https://www.python.org/)
- [Flask](https://flask.palletsprojects.com/en/stable/)
- [Raspberry Pi](https://www.raspberrypi.com/)
- [Docker](https://www.docker.com/)
- [NGINX](https://nginx.org/)
- [ThingsBoard](https://thingsboard.io/docs/user-guide/install/docker/)
- [MQTT](https://mqtt.org/)
- [Apache Kafka](https://kafka.apache.org/)
- [Google OAuth2 Provider](https://developers.google.com/identity/protocols/oauth2)
- Sensors

## Security

#### Set configuration and secrets
```
touch .env
```

The .env file must have the following fields:

```
/* .env */

SERVER_SECRET_KEY=<YOUR SECRET KEY>
GOOGLE_CLIENT_SECRET=<YOUR GOOGLE CLIENT SECRET>
GOOGLE_CLIENT_ID=<YOUR GOOGLE CLIENT ID>
INITIAL_ADMIN_NAME=<YOUR INITIAL ADMIN NAME>
INITIAL_ADMIN_GOOGLE_EMAIL=<YOUR INITIAL ADMIN GOOGLE EMAIL>
```