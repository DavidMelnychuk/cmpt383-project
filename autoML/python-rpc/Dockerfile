FROM tensorflow/tensorflow:nightly

RUN mkdir -p /app/src

WORKDIR /app/src

COPY . .

RUN pip install -r requirements.txt

# Install TF Serving
RUN echo "deb [arch=amd64] http://storage.googleapis.com/tensorflow-serving-apt stable tensorflow-model-server tensorflow-model-server-universal" | tee /etc/apt/sources.list.d/tensorflow-serving.list && \
curl https://storage.googleapis.com/tensorflow-serving-apt/tensorflow-serving.release.pub.gpg | apt-key add -

RUN apt-get update && apt-get install tensorflow-model-server

CMD ["python", "amqp_server.py"]
