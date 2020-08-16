from flask import Flask
from flask import request
from werkzeug.utils import secure_filename
from flask_cors import CORS
import requests
import json
from skimage.io import imread
from flask import jsonify
import numpy as np
import os
# import tensorflow as tf
# from keras.preprocessing import image


app = Flask(__name__)
CORS(app)

# Assume model name is always the same
PREDICT_ENDPOINT = 'http://python-rpc:8501/v1/models/fashion_model:predict'

@app.route("/")
def hello():
    return "Hello World from Flask"

@app.route('/predict', methods=['POST'])
def predict():
    # Save image to local filesystem
    file = request.files['image']
    file.save(secure_filename(file.filename))

    # Create JSON payload for tensorflow REST API
    image_contents = imread(file.filename).tolist()
    # image = tf.keras.preprocessing.image.load_img(file.filename, target_size=(224, 224))
    # image_contents = tf.keras.preprocessing.image.img_to_array(image)
    # image_contents = np.expand_dims(image_contents, axis=0).tolist()
    data = json.dumps({'instances': [image_contents]})
    headers = {"content-type": "application/json"}

    # Get prediction JSON response
    resp = requests.post(PREDICT_ENDPOINT, data=data, headers=headers)
    predictions = json.loads(resp.text)['predictions']
    # predicted = np.argmax(predictions[0])
    
    # Clean up, remove file before returning response
    if os.path.exists(file.filename):
        os.remove(file.filename)

    # return jsonify(resp.text)
    return json.dumps(predictions)

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=True, port=5000)
