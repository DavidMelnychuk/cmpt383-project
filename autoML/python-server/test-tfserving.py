import base64
import requests
import json

IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Scifresh_%28Apple%29.jpg/1024px-Scifresh_%28Apple%29.jpg"
dl_req = requests.get(IMAGE_URL)

jpg_bytes = base64.b64encode(dl_req.content).decode('utf-8')
predict_request = {
    "instances": [{"b64": jpg_bytes}]
}


headers = {"content-type": "application/json"}
resp = requests.post('http://localhost:8501/v1/models/fashion_model:predict', data=predict_request, headers=headers)
print(resp.content.decode('utf-8'))
print('hello world')
predictions = json.loads(resp.text)['predictions']
print(predictions)
