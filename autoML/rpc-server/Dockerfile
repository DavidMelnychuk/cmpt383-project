FROM tensorflow/tensorflow:nightly

RUN mkdir -p /app/src

WORKDIR /app/src

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "amqp_server.py"]
