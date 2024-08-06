from flask import render_template, Blueprint

view_home_bp = Blueprint('home', __name__, template_folder=...)

@view_home_bp.route('/home')
def get_home_page():
    return render_template('home.html')
