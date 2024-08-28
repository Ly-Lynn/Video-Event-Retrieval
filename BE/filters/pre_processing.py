'''
    Xử lí offline dữ liệu: gồm xử lí OCR, ASR, OD và thêm dữ liệu vào Elastic Search
'''
from filters.ocr import getOCR
from filters.asr import getASR
from filters.od import getOD
from filters.elasticSearch import add_to_elastic

# Thay đổi tham số phù hợp
ocr_res = getOCR()
asr_res = getASR()
od_res = getOD()

def createElastic (frameIDs):
    '''
    Input: list[frameIDs]
    Return: none
    '''
    data_list = []
    for frameid in frameIDs:
        data_list.append({
            'id': frameid,
            'ocr_res': ocr_res[frameid],
            'asr_res': asr_res[frameid],
            'od_res': od_res[frameid]
        })
    add_to_elastic(data_list)
