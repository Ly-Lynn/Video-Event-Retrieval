import os
import base64
import io
import numpy as np
from PIL import Image
import json
from tqdm import tqdm
import random
def read(img_path):
    '''
    Input: đường dẫn đến ảnh jpg
    Output: Lưu ảnh dưới dạng webp trong cùng thư mục với tên file khác
    '''
    img = Image.open(img_path)
    path = os.path.normpath(img_path).split(os.sep)
    
    frame_id = os.path.splitext(path[-1])[0]
    vid_name = path[-2]
    webp_dir = os.path.join('D:', 'codePJ', 'AIC', vid_name)
    os.makedirs(webp_dir, exist_ok=True) 
    webp_path = os.path.join(webp_dir, f'{frame_id}.webp')
    img.save(webp_path, format='WEBP')
    # print(f'Ảnh đã được lưu tại: {webp_path}')

def random_create(frame_index_list):
    random.shuffle(frame_index_list)
    return frame_index_list
def create_json():
    frame_index_list = []
    path = r'D:\codePJ\AIC\FE\aic\BE\test\codePJ\AIC'
    for vid in tqdm(os.listdir(path)):
        vid_path = path + '\\' + vid
        for frame in tqdm(os.listdir(vid_path)):
            frame_name = frame.split('.')[0]
            frame_index_list.append(vid+frame_name)

    sorted_list = random_create(frame_index_list)
    # with open('test.txt', 'w') as file:
    #     file.write(sorted_list)
    datas = []
    for data in sorted_list:
        component = {
            'id': data[-4:],
            'vid': data[:-4],
            'score': 123.345,
            'ocr': ['duy hưng, đường, trần'],
            'asr': ['xin', 'chào', 'phóng', 'viên'],
            'od': [{
                'object': 'person',
                'bbox': [222,333,111,444]
            },
            {
                'object': 'cat',
                'bbox': [123,234,567,788]
            }]
        }
        datas.append(component)

    with open('test.json', 'w') as file:
        json.dump(datas, file, indent=4)

def load_json_test():
    with open('test.json', 'r') as file:
        datas = json.load(file)
    print(datas[0])

create_json()