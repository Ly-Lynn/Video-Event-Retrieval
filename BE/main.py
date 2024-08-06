from flask import Flask
from milvus.utils.function import *
from controller import create_app

import milvus.config

app = create_app()


if __name__ == '__main__':
    app.run(debug=True)
