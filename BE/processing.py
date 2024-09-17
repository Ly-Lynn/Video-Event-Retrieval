import os
import base64
import io
from PIL import Image
from configs import configs
from filters.stage_processing import frames_sorting
from filters.elasticSearch import search
from core_model import call_core_model


def get_data (data:dict):
    query = data.get('query')
    ocr = data.get('ocr')
    asr = data.get('asr')
    od = data.get('od')
    return query, ocr, asr, od

def get_image_from_ID(frameId):
    '''
        Lấy frame từ database thông qua ID: tên vid + idframe (6 chữ số)
    '''

# def score_calculate(query_score, ocr_score, asr_score, od_score):
#     '''
#     Tính điểm cho 1 frame gồm tổng khoảng cách query tới frame + trọng số * điểm thành phần
#     '''



def ranking(query_score, listOCR, w_ocr, listASR, w_asr, listOD, w_od):
    '''
    Input:
        query_score: score của query theo model
        listOCR, listASR: output của elasticSearch
            [{"_index": "frames",
                "_id": "frame_id",
                "_score": 10.567,
                "_source": {
                    "ocr_res": "",
                    "frame_id": 
                    "video": 
                    "asr_res": 
                    "od_res": 
                },{},...] 
        w_ocr, w_asr, w_od: trọng số ocr, asr, od
    Return: list các dict { 'id':frame id, 
                            'vid': video, 
                            'info':{'ocr_res':, 'asr_res': , 'od_res':}, 
                            'score': float} 
                với score là tổng số điểm cuối cùng 
            được sắp xếp từ cao xuống thấp theo score
    '''
    aggerated_info = [{"_index": "frames",
                        "_id": query_score[i],
                        "_score": (listOCR[i]["_score"]*w_ocr + listASR[i]["_score"][i]*w_asr + 
                        listOD[i]["_score"]*w_od + 2*query_score[i]["_score"]),
                        "_source": {
                        "ocr_res": listOCR[i]["ocs_res"],
                        "frame_id": query_score[i]["_id"][9:15],
                        "video": query_score[i]["_id"][0:8],
                        "asr_res": listASR[i]["asr_res"],
                        "od_res": listOD[i]["od_res"]
                        }} for i in range(len(query_score))] 

    aggerated_info.sort(key=lambda x : x["_score"])
    return aggerated_info


def process_single(data):
    text_query = data['query']

    ocr_query = data['ocr']['query']
    ocr_weight = data['ocr']['weight']

    asr_query = data['asr']['query']
    asr_weight = data['asr']['weight']

    od_weight = data['od']['weight']

    similarity_result = call_core_model(text_query)
    ocr_result = search(ocr_query, search_type='ocr')
    asr_result = search(asr_query, search_type='asr')
    od_result = search(data['od']['results'], search_type='od')

    aggerated_result = ranking(similarity_result, ocr_result, ocr_weight, asr_result, asr_weight, od_result, od_weight)

    return aggerated_result


def process_stages(stage_data):
    stage_result = {}
    for i, data in stage_data.items():
        stage_result[i] = process_single(data)
    
    return stage_result


def processing(data):
    '''
    Xử lí đầu vào data:
        dict: truy vấn đơn
        list: truy vấn stages
    Return: kết quả của hàm encode_b64
    '''
    if isinstance(data, dict):
        '''
            Truy vấn đơn với hàm search(query, type) với type là loại truy vấn (có loại nào thì truy vấn loại đó)
            Sau đó sẽ đi qua hàm ranking để tính toán score và sort lần cuối
        '''
        result = process_single(data)
        return result
    
    elif isinstance(data, list):
        '''
            Nếu truy vấn stage thì sẽ truy vấn từng stage sau đó ghép kết quả với frames_sorting
        '''
        result = process_stages(data)
        

        return result