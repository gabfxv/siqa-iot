FROM python:3.13-slim
WORKDIR /app
COPY . .
RUN pip install tb-rest-client==4.0.0 paho-mqtt==2.1.0
CMD ["python", "emulator.py"]