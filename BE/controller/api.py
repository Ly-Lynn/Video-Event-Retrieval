from flask import request, Blueprint, request, jsonify
from BE import processing
from milvus.utils.function import search_query

api_bp = Blueprint('api', __name__)

@api_bp.route('', methods=['POST'])
def get_single ():
    '''
    data nhận từ FE có dạng:
    {
        query: string,
        ocr: {query: string, weight: int},
        asr: {query: string, weight: int},
        od: {results:các list({object:string, coordinates:list(4)},
            weight: int}
    }           
    '''
    data = request.json
    results = processing(data)
    return jsonify(results)
    

@api_bp.route('', methods=['POST'])
def get_stages ():
    '''
    data nhận từ FE có dạng:
    [data: {query: string,
            ocr: {query: string, weight: int},
            asr: {query: string, weight: int},
            od: {results:các list({object:string, coordinates:list(4)},
            weight: int}
        },
    tabID:int},...]           
    '''
    data = request.json
    results = processing(data)
    return jsonify(results)


@api_bp.route('/get-result-by-text', methods=['GET'])
def get_result_by_text():
    text = request.args.get('text')
    if text:
        return {'result': f'You entered: {text}'}
    else:
        return {'error': 'No text provided'}, 400
    



'''
* must be covered by Multi_modality
search_query("dog and dog")
'''
