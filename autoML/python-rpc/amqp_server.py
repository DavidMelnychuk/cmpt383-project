# python3 amqp_server.py
# based on https://www.rabbitmq.com/tutorials/tutorial-six-python.html
import pika
import json
import requests
import urllib.request
import os
from zipfile import ZipFile
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing import image_dataset_from_directory
import numpy as np
import subprocess
import tempfile

BASE_URL = 'http://golang-server:8080/uploadedFiles/'

amqp_url = os.environ['AMQP_URL']
connection = pika.BlockingConnection(pika.URLParameters(amqp_url))

channel = connection.channel()

channel.queue_declare(queue='rpc_queue')

# TODO: NICE TO HAVE: Better error handling, e.g send fail response
def write_file(filePath, content):
    if(len(content) == 0):
        print('Error Empty File!')
    else:
        with open(filePath, 'wb') as file:
            file.write(content)
        
def download_and_unzip_files(request):
    # Get file names and make training directory
    fileOne = request['fileOne']
    fileTwo = request['fileTwo']

    fileOneName = os.path.splitext(fileOne)[0]
    fileTwoName = os.path.splitext(fileTwo)[0]

    dir_name = fileOneName + "-" + fileTwoName + "-" + "images"
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)
        
    # Download and save files   
    # TODO: NICE TO HAVE: Better error handling, e.g send fail response
    # TODO: "File One was Empty!" and then output back to user...
    fileOneURL = BASE_URL + fileOne
    fileTwoURL = BASE_URL + fileTwo

    fileOneRes = requests.get(fileOneURL)
    write_file(fileOne, fileOneRes.content)
    fileTwoRes = requests.get(fileTwoURL)
    write_file(fileTwo, fileTwoRes.content)

    # Unzip files
    with ZipFile(fileOne, 'r') as zip_file:
        zip_file.extractall(os.path.join(dir_name, fileOneName))
    
    with ZipFile(fileTwo, 'r') as zip_file:
        zip_file.extractall(os.path.join(dir_name, fileTwoName))
    
    # Remove zip files
    os.remove(fileOne)
    os.remove(fileTwo)
    return dir_name, {'status': "success"}

def train_model(dir_name, fileOneName, fileTwoName):
    # Code adapted from https://www.tensorflow.org/tfx/tutorials/serving/rest_simple#create_your_model
    # and https://keras.io/examples/vision/image_classification_from_scratch/

    image_size = (224, 224)
    batch_size = 32
    NUM_CLASSES = 2

    # Create training and validation datasets
    # Need to specify class_names to maintain label order of 0,1 for file 1, file 2
    # else it goes in alphanumeric order of their names
    train_ds = image_dataset_from_directory(
        dir_name,
        labels='inferred',
        label_mode='binary', 
        class_names=[fileOneName, fileTwoName],
        validation_split=0.2,
        subset="training",
        seed=1337,
        image_size=image_size,
        batch_size=batch_size,
    )

    val_ds = image_dataset_from_directory(
        dir_name,
        labels='inferred',
        label_mode='binary', 
        class_names=[fileOneName, fileTwoName],
        validation_split=0.2,
        subset="validation",
        seed=1337,
        image_size=image_size,
        batch_size=batch_size,
    )

    # Improve performance with prefetching
    train_ds = train_ds.prefetch(buffer_size=32)
    val_ds = val_ds.prefetch(buffer_size=32)
    
    # Transfer learning with pretrained base model
    base_model = keras.applications.MobileNetV2(
        include_top=False,
        weights='imagenet',
        classes=NUM_CLASSES,
        pooling='avg',
        input_shape=(224,224,3))

    #Freeze base model
    base_model.trainable = False

    model = keras.Sequential()
    model.add(base_model)
    model.add(layers.Flatten())
    model.add(layers.Dense(NUM_CLASSES, activation='softmax')) # Last output/classifcation layer. 

    # 1 Epoch for the sake of speed for Demo
    print('Training Model')
    epochs = 1
    model.compile(optimizer='adam', 
                loss='binary_crossentropy',
                metrics=['accuracy'])
    model.fit(train_ds, validation_data=val_ds, batch_size=batch_size, epochs=epochs)

    results = model.evaluate(val_ds)
    print("test loss, test acc:", results)

    MODEL_DIR = tempfile.gettempdir()
    version = 1
    export_path = os.path.join(MODEL_DIR, str(version))
    print('export_path = {}\n'.format(export_path))

    tf.keras.models.save_model(
        model,
        export_path,
        overwrite=True,
        include_optimizer=True,
        save_format=None,
        signatures=None,
        options=None
    )

    print("Done saving model.")
    os.environ["MODEL_DIR"] = MODEL_DIR
    return model, MODEL_DIR

def serve_model():
    bash_cmd = "nohup tensorflow_model_server --port=8500 --rest_api_port=8501 \
  --model_name=fashion_model --model_base_path=" + os.environ["MODEL_DIR"] + " >server.log 2>&1 &"
    os.system(bash_cmd)

def on_request(ch, method, props, body):
    try:
        request = json.loads(body.decode('utf-8'))
    except json.decoder.JSONDecodeError:
        ch.basic_ack(delivery_tag=method.delivery_tag)
        print('Bad request:', body)
        return

    fileOne = request['fileOne']
    fileTwo = request['fileTwo']

    fileOneName = os.path.splitext(fileOne)[0]
    fileTwoName = os.path.splitext(fileTwo)[0]

    dir_name, response = download_and_unzip_files(request)
    print('Finished Downloading')
    model, model_dir = train_model(dir_name, fileOneName, fileTwoName)
    serve_model()
    print('Finished Serving')
    body = json.dumps(response).encode('utf-8')

    ch.basic_publish(exchange='',
                     routing_key=props.reply_to,
                     properties=pika.BasicProperties(correlation_id=props.correlation_id),
                     body=body)
                     
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='rpc_queue', on_message_callback=on_request)

print("Awaiting RPC requests")
channel.start_consuming()