# python3 amqp_server.py
# based on https://www.rabbitmq.com/tutorials/tutorial-six-python.html
import pika
import json
import requests
import urllib.request

# parameters = pika.URLParameters
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))

channel = connection.channel()

channel.queue_declare(queue='rpc_queue')

def get_length(request):
    length = len(request['string'])
    return {'length': length}

def download_file(request):
    fileOne = request['fileOne']
    fileTwo = request['fileTwo']
    print(fileOne)
    print(fileTwo)
    return{'status': "success",
    'test': True,
    'test2': 5}

    # url = 'http://localhost:8080/uploadedFiles/apple.zip'
    # r = requests.get(url)
    # if(len(r.content) == 0):
    #     print('Error Empty File. ')
    
    # with open('apple.zip', 'wb') as file:
    #     file.write(r.content)

def on_request(ch, method, props, body):
    try:
        request = json.loads(body.decode('utf-8'))
    except json.decoder.JSONDecodeError:
        ch.basic_ack(delivery_tag=method.delivery_tag)
        print('Bad request:', body)
        return

    response = download_file(request)
    print(response)
    # print(request)    
    # download_file('xd')

    body = json.dumps(response).encode('utf-8')
    # body = json.dumps(response).encode('utf-8')
    
    ch.basic_publish(exchange='',
                     routing_key=props.reply_to,
                     properties=pika.BasicProperties(correlation_id=props.correlation_id),
                     body=body)
                     
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='rpc_queue', on_message_callback=on_request)

print("Awaiting RPC requests")
channel.start_consuming()