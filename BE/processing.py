import os
import base64
import io
from PIL import Image
from BE.configs import configs_info
from filters.stage_processing import frames_sorting
from filters.elasticSearch import search

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


def encode64(np_img):
    '''
    Input: ảnh dạng numpy array 
    Return: Encode image thành dạng base64
    '''
    np_img = Image.fromarray(np_img.astype('uint8'))
    buffered = io.BytesIO()
    np_img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str

def encode_b64(images) -> list:
    '''
    Input: list[Frame] là kết quả cuối cùng của quá trình truy vấn
    Return: list các images được encode bằng hàm encode64
    '''
def change_to_wbp (img_path):
    img = Image.open(img_path)
    

def score_calculate(query_encoded, frame):
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
    Return: list các dict {'images': ,
                            'id':frame id, 
                            'vid': video, 
                            'info':{'ocr_res':, 'asr_res': , 'od_res':}, 
                            'score': float} 
                với score là tổng số điểm cuối cùng 
            được sắp xếp từ cao xuống thấp theo score
    '''

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
        return
    elif isinstance(data, list):
        '''
            Nếu truy vấn stage thì sẽ truy vấn từng stage sau đó ghép kết quả với frames_sorting
        '''
        return
