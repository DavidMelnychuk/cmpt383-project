# python3 amqp_server.py
# based on https://www.rabbitmq.com/tutorials/tutorial-six-python.html
import pika
import json
import requests
import urllib.request
import os
from zipfile import ZipFile

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
    return{'status': "success"}

def on_request(ch, method, props, body):
    try:
        request = json.loads(body.decode('utf-8'))
    except json.decoder.JSONDecodeError:
        ch.basic_ack(delivery_tag=method.delivery_tag)
        print('Bad request:', body)
        return

    response = download_and_unzip_files(request)

    print('Finished Downloading')


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