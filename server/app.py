from flask import Flask, jsonify, request
from flask_cors import CORS
from api.routes import predictions_blueprint

app = Flask(__name__)
CORS(app)

app.register_blueprint(predictions_blueprint, url_prefix='/api')

if __name__ == "__main__":
    app.run(debug=True)
