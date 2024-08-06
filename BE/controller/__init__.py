from flask import Flask
from .view_home import view_home_bp
from .api import api_bp

def create_app():
    app = Flask(__name__)
    app.register_blueprint(view_home_bp)
    app.register_blueprint(api_bp)
    return app
