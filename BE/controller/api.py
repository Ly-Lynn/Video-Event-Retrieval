from flask import request, Blueprint

api_bp = Blueprint('api', __name__)

@api_bp.route('/get-result-by-text', methods=['GET'])
def get_result_by_text():
    text = request.args.get('text')
    if text:
        return {'result': f'You entered: {text}'}
    else:
        return {'error': 'No text provided'}, 400