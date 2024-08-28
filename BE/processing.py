import os
import base64
import io
from PIL import Image
from object.VideoFrame import Frame
# Xử lí stage
from filters.stage_processing import frames_sorting
# Xử lí OCR -> score
from filters.ocr import scoreOCR
# Xử lí ASR -> score
from filters.asr import scoreASR
# Xử lí object detection -> score
from filters.od import scoreOD
from filters.elasticSearch import search

def get_data (data:dict):
    query = data.get('query')
    ocr = data.get('ocr')
    asr = data.get('asr')
    od = data.get('od')

    return query, ocr, asr, od

def encode_b64(images:list[Frame]) -> list:
    '''
    Input: list[Frame] là kết quả cuối cùng của quá trình truy vấn
    Return: list các images được encode
    '''
def score_calculate(query_encoded, frame: Frame):
    '''
    Tính điểm cho 1 frame gồm tổng khoảng cách query tới frame + trọng số * điểm thành phần
    '''
def ranking(query_encoded, listOCR, w_ocr, listASR, w_asr, listOD, w_od):
    '''
    Input:
        query_encoded: query được encode
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
    Return: list các dict {'id':frame.id, 'info':Frame, 'score': float} 
            với score là tổng số điểm cuối cùng được sắp xếp từ cao xuống thấp theo score
    '''

def processing(data):
    '''
    Xử lí đầu vào data:
        dict: truy vấn đơn
        list: truy vấn stages
    Return: kết quả của hàm encode_b64
    '''
    if isinstance(data, dict):
        return
    elif isinstance(data, list):
        return