import requests
import json
from skimage.io import imread

image = "test-image.jpg"
image_content = imread(image).tolist()
data = json.dumps({'instances': [image_content]})


headers = {"content-type": "application/json"}
resp = requests.post('http://localhost:8501/v1/models/fashion_model:predict', data=data, headers=headers)
print(resp.text)
print(json.loads(resp.text))

# print(resp.content.decode('utf-8'))
# print('hello world')
# predictions = json.loads(resp.text)
# print(predictions)
