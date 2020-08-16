# FROM tensorflow/tensorflow:nightly
FROM tiangolo/uwsgi-nginx-flask:python3.8

RUN mkdir -p /app

WORKDIR /app

COPY ./app .

RUN pip install -r requirements.txt

ENV FLASK_APP main.py

CMD ["flask", "run", "-h", "0.0.0.0", "-p", "5000"]