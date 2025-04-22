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
- ESP32
- [Mosquitto](https://mosquitto.org/)
- [Docker](https://www.docker.com/)
- [NGINX](https://nginx.org/)
- [Kura](https://eclipse-kura.github.io/kura/docs-release-5.6/)
- [Kapua](https://projects.eclipse.org/projects/iot.kapua)
- Sensors

## Security
The project uses two-way authentication with TLS/SSL between the Mosquitto broker and server replicas.

### Configuring the keys
 
#### Create certificate folder
```
mkdir certs
cd ./certs
```

#### Create CA certificate
```
openssl genpkey -algorithm RSA -out ca.key -aes256
openssl req -key ca.key -new -x509 -out ca.crt -days 3650
```

#### Create server certificate
```
openssl genpkey -algorithm RSA -out server.key
openssl req -new -key server.key -out server.csr
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 3650
```

#### Create client certificate
```
openssl genpkey -algorithm RSA -out client.key
openssl req -new -key client.key -out client.csr
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 3650
```

#### Create server secret key
```
touch .env
```

O arquivo .env deve ter os seguintes dados:

```
/* .env */

SERVER_SECRET_KEY=<SUA SECRET KEY>
GOOGLE_CLIENT_SECRET=<SEU GOOGLE CLIENT SECRET>
GOOGLE_CLIENT_ID=<SEU GOOGLE CLIENT ID>
```