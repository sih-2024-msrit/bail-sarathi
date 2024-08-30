from flask import Flask, request, jsonify
import os
import sys
from config import ai


app = Flask(__name__)

#@app.route('/run-llm', methods=['POST'])
#def run_llm():
 #   input_data = request.json.get('input')
  #  output_data = your_model_script.run_llm(input_data)
   # return jsonify(output=output_data)

if __name__ == '__main__':
    app.run(port=5000)
