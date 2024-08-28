from elasticsearch import Elasticsearch, helpers
from tqdm import tqdm

def add_to_elastic(data_list):
    client = Elasticsearch(cloud_id="YOUR_CLOUD_ID", api_key="YOUR_API_KEY")
    actions = [
    {
        "_index": "frames",
        "_id": frame['id'],
        "_source": {
            "ocr_res": frame['ocr_res'],
            "asr_res": frame['asr_res'],
            'od_res': frame['od_res']
        }
    }
    for frame in data_list
    ]   
    helpers.bulk(client, actions)

def search(ocr_query=None, asr_query=None, od_query=None):
    '''
    Hàm search OCR/AS/OD 
    Return: list kết quả truy vấn từ cao xuống thấp
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
    '''

    client = Elasticsearch(cloud_id="YOUR_CLOUD_ID", api_key="YOUR_API_KEY")
    search_query = {}
    if ocr_query and asr_query:
        search_query = {
            "query": {
                "should":[
                    {"match": {'ocr_res':ocr_query}},
                    {"match": {'asr_res':asr_query}},
                ]
            },
            "sort": [
                {"_score": {"order": "desc"}}  
            ]
        }
    else:
        query = ocr_query if ocr_query else asr_query
        search_query = {
            "query": {
                "should":[
                    {"match": {'ocr_res' if ocr_query else 'asr_res' : query}}
                ]
            },
            "sort": [
                {"_score": {"order": "desc"}}  
            ]
        }
    if od_query:
        search_query["query"]["must"] = [{"match": {'od_res.object':obj['object']}} for obj in od_query]

    results = client.search(index="frames", body=search_query)
    
    return results['hits']['hits']

