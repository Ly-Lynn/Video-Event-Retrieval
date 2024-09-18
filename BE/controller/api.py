from flask import request, Blueprint, request, jsonify
import json
import pandas as pd
import os
import sys
from BE.configs.configs_info import configs as cfg
# import processing
# from milvus.utils.function import search_query
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

api_bp = Blueprint('api', __name__)

@api_bp.route('/get-single', methods=['POST'])
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
    print("data",data)
    
    #--------------TEST---------------
    with open(r'D:\codePJ\AIC\FE\aic\BE\test\test.json', 'r') as file:
        results = json.load(file)
    # results = processing(data)
    
    return jsonify(results)
    

@api_bp.route('/get-stages', methods=['POST'])
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
    print(data)
    #--------------TEST---------------
    with open(r'D:\codePJ\AIC\FE\aic\BE\test\test_stage.json', 'r') as file:
        results = json.load(file)
    return jsonify(results)


@api_bp.route('/get-result-by-text', methods=['GET'])
def get_result_by_text():
    text = request.args.get('text')
    if text:
        return {'result': f'You entered: {text}'}
    else:
        return {'error': 'No text provided'}, 400
    
@api_bp.route('/get-submission', methods=['POST'])
def get_submission():
    """
    data nhận từ FE có dạng:
    {
        id: string,
        vid: string,
        score: float,
        query: string,
        ocr: {query: string, weight: int},
        asr: {query: string, weight: int},
        od: {results:các list({object:string, coordinates:list(4)},
            weight: int}
    }
    """
    receive = request.json
    output_file = cfg['OUTPUT_PATH'] + receive['file'] + '.csv'
    data = receive['data']
    vid = [dt['vid'] for dt in data]
    vid_id = [int(dt['id']) for dt in data]
    df = pd.DataFrame.from_dict({"video_name" : vid, "index" : vid_id})
    df.to_csv(output_file, header=False, index=False)
    return jsonify({'status': 'success'})


'''
* must be covered by Multi_modality
search_query("dog and dog")
'''
