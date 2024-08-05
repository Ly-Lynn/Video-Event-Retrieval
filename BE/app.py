from flask import Flask
from blueprints.my_blueprint import my_blueprint
from milvus.utils.functions import *

import milvus.config

app = Flask(__name__)


if __name__ == '__main__':
    app.run(debug=True)
