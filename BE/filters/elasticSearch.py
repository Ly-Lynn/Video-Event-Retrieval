from elasticsearch import Elasticsearch
from tqdm import tqdm
from configs import configs

def calculate_iou(box1, box2):
    x1, y1, x2, y2 = box1
    x1_, y1_, x2_, y2_ = box2

    # Calculate the intersection area
    xi1 = max(x1, x1_)
    yi1 = max(y1, y1_)
    xi2 = min(x2, x2_)
    yi2 = min(y2, y2_)
    intersection = max(0, xi2 - xi1) * max(0, yi2 - yi1)
    box1_area = (x2 - x1) * (y2 - y1)
    box2_area = (x2_ - x1_) * (y2_ - y1_)
    union = box1_area + box2_area - intersection
    return intersection / union if union != 0 else 0

def search_od(images, input_objects):
    
    return 

def search(query, search_type='ocr'):
    '''
    Hàm search OCR/ASR/OD 
    Input: câu query
            nếu search OD thì query sẽ là list[dict{'object', 'coordinates'}]
    Return: list kết quả truy vấn từ cao xuống thấp
            [{"_index": "frames",
                "_id": "frame_id", #L01_V010000111
                "_score": 10.567,
                "_source": {
                    "ocr_res": "",
                    "frame_id": 
                    "video": 
                    "asr_res": 
                    "od_res": 
                },{},...] 
    '''
    client = Elasticsearch(cloud_id=configs['CLOUD_ID'], api_key=configs['API_KEY'])
    if search_type == 'ocr' or search_type == 'asr':
        query_terms = query.split() 

        search_query = {
            "query": {
                "function_score": {
                    "query": {
                        "bool": {
                            "should": [
                                {
                                    "bool": {
                                        "must": [
                                            {"match": {'ocr_res' if search_type == 'ocr' else 'asr_res': term}}
                                            for term in query_terms
                                        ]
                                    }
                                },
                                {
                                    "bool": {
                                        "should": [
                                            {"match": {'ocr_res' if search_type == 'ocr' else 'asr_res': term}}
                                            for term in query_terms
                                        ],
                                        "minimum_should_match": 1
                                    }
                                }
                            ]
                        }
                    },
                    "functions": [
                        {
                            "filter": {
                                "bool": {
                                    "must": [
                                        {"match": {'ocr_res' if search_type == 'ocr' else 'asr_res': term}}
                                        for term in query_terms
                                    ]
                                }
                            },
                            "weight": 10  
                        }
                    ],
                    "boost_mode": "multiply" 
                }
            },
            "sort": [
                {"_id": {"order": "asc"}} 
            ]
        }

        results = client.search(index="frames", body=search_query)
        results = results['hits']['hits']
    if search_type=='od':
        results = search_od(query)
    return results

