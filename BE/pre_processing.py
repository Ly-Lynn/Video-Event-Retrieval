'''
    Xử lí offline dữ liệu: gồm xử lí OCR, ASR, OD và thêm dữ liệu vào Elastic Search
'''
from elasticsearch import Elasticsearch, helpers
from configs import configs
import json
import os

def load_json(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)

ocr = load_json(configs['OCR_DATA'])
asr = load_json(configs['ASR_DATA'])
od = load_json(configs['OD_DATA'])

def add_to_elastic(data_list):
    client = Elasticsearch(cloud_id=configs['CLOUD_ID'], api_key=configs['API_KEY'])
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

def createElastic():
    '''
    Input: list[frameIDs]
    Return: none
    '''
    llist = os.listdir(configs['FRAMES_PATH'])
    
    frameIDs = [os.path.splitext(each)[0] for each in llist]
    data_list = []
    for frameid in frameIDs:
        if frameid in ocr and frameid in asr and frameid in od:
            data_list.append({
                'id': frameid,
                'ocr_res': ocr[frameid],
                'asr_res': asr[frameid],
                'od_res': od[frameid]
            })
        else:
            print(f"Warning: Data for frameid '{frameid}' not found in one or more datasets.")
    
    add_to_elastic(data_list)

if __name__ == '__main__':
    createElastic()