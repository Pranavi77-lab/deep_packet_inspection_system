from flask import Flask
from flask_cors import CORS
from api.routes import api

app = Flask(__name__)

# Allow requests from React
CORS(app)

app.register_blueprint(api)


@app.route("/")
def home():
    return "Deep Packet Inspection API Running"


if __name__ == "__main__":
    app.run(debug=True)