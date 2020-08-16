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


app = Flask(__name__)
CORS(app)

PREDICT_ENDPOINT = 'http://python-rpc:8501/v1/models/model:predict'

@app.route('/predict', methods=['POST'])
def predict():
    # Save image to local filesystem
    file = request.files['image']
    file.save(secure_filename(file.filename))

    # Create JSON payload for tensorflow REST API
    image_contents = imread(file.filename).tolist()
    data = json.dumps({'instances': [image_contents]})
    headers = {"content-type": "application/json"}

    # Get prediction as JSON Response from TF REST API. 
    resp = requests.post(PREDICT_ENDPOINT, data=data, headers=headers)
    predictions = json.loads(resp.text)['predictions']

    # Clean up, remove file before returning response
    if os.path.exists(file.filename):
        os.remove(file.filename)

    return json.dumps(predictions)

if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=True, port=5000)