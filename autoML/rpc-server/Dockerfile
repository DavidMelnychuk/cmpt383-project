FROM tensorflow/tensorflow:nightly

RUN mkdir /app

WORKDIR /app

COPY . .

CMD ["python", "amqp_server.py"]
