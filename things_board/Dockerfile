FROM python:3.13-slim
WORKDIR /app
COPY . .
RUN pip install tb-rest-client==4.0.0 confluent-kafka==2.10.0
CMD ["python", "init_thingsboard.py"]