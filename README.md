# CMPT 383 Project: AutoML

My final project for [CMPT-383](https://ggbaker.ca/prog-langs/) which required us to build a system using three programming languages and two different methods of communication.

## Overall Goal

Inspired by Google's [Cloud AutoML](https://cloud.google.com/automl), this project implements a basic automated machine learning application where a user can upload a set of images to train a binary image classifier and test it on new images. This allows non-experts to experiment and see the results of machine learning.

## Languages

The languages used in this project are Go, Python, and Javascript.

### Go

Go code is in autoML/server. Go is used with the [Gin](https://github.com/gin-gonic/gin) framework to be a REST API and file server to store uploaded training sets. It's also used as an RPC client to communicate with the Python server which does model training (autoML/server/controllers/rpcController.go).

### Python

Python code is in autoML/python-rpc and autoML/python-rest. In python-rpc, Python is used as an RPC server which downloads the training sets from the Go server and trains a ML model with [Keras](https://keras.io/). After training, it then saves and serves the model with [TensorFlow Serving](https://www.tensorflow.org/tfx/tutorials/serving/rest_simple) on the same docker container.

In python-rest, Python is used as a REST API with [Flask](https://flask.palletsprojects.com/en/1.1.x/) to preprocess the image data and send a prediction request to the served model.

### JavaScript

JavaScript code is in autoML/client/src. JavaScript is used with [React](https://reactjs.org/) to write front-end code for displaying information and making requests to the servers.

## Cross-Language Communication

The languages communicate with REST APIs and remote procedure calls via RabbitMQ.

## Demo

To get the project working, run `docker-compose up`. The project can take a while to build the first time depending on your computer and network speed (roughly 5 minutes on my machine).

After the project finishes building and all servers are running, you can access the application at **localhost:3000**.

I have provided sample input files for training and prediction under the examples folder. These files were sampled from https://www.kaggle.com/moltean/fruits.

1. Upload Apple.zip for class 1.
2. Upload Banana.zip for class 2.
3. Click train model after uploading files and wait for the model to finish training (could take a few minutes depending on your machine).
4. After model training completed, select a test image to predict and click the predict button to view results.

**Note:** Because everything is being run locally with multiple docker containers, compute power is limited and varies depending on your machine. Because of this, a very small dataset is used and the model is only trained with 1 epoch and MobileNetV2 for the sake of demo speed and purposes. This results in a very low accuracy score and mislabelling, especially for unseen test images. In practice, the python-server could be cloud-hosted with more access to compute power and thus the ability to train for more epochs to give usable results without taking an unreasonably long time.

## Future Work

If I were to expand on this project, I would put the machine learning server on a separate cloud service and add user configuration options to training such as letting users tune the number of epochs, batch size, and learning rate.
If I were to do this project without the requirements of using three different programming languages, I would probably write it all in JavaScript using React, Node, and Tensorflow.js or all in Python with Flask and Keras.
