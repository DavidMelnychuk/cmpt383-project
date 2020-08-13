# python3 amqp_server.py
# based on https://www.rabbitmq.com/tutorials/tutorial-six-python.html
import pika
import json
import requests
import urllib.request
import os

BASE_URL = 'http://localhost:8080/uploadedFiles/'

amqp_url = os.environ['AMQP_URL']
connection = pika.BlockingConnection(pika.URLParameters(amqp_url))

channel = connection.channel()

channel.queue_declare(queue='rpc_queue')

# TODO: NICE TO HAVE: Better error handling, e.g send fail response
def write_file(fileName, content):
    if(len(content) == 0):
        print('Error Empty File!')
    else:
        with open(fileName, 'wb') as file:
            file.write(content)
        
def download_file(fileName):
    fileURL = BASE_URL + fileName
    # Download and save file.
    # TODO: NICE TO HAVE: Better error handling, e.g send fail response
    # "File One was Empty!" and then output back to user...
    res = requests.get(fileURL)
    write_file(fileName, res.content)
    return{'status': "success"}

def on_request(ch, method, props, body):
    try:
        request = json.loads(body.decode('utf-8'))
    except json.decoder.JSONDecodeError:
        ch.basic_ack(delivery_tag=method.delivery_tag)
        print('Bad request:', body)
        return

    fileOne = request['fileOne']
    fileTwo = request['fileTwo']
    print(fileOne)
    print(fileTwo)

    response = download_file(fileOne)
    response = download_file(fileTwo)
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