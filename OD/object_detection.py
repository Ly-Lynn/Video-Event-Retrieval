# Copyright (c) OpenMMLab. All rights reserved.
import os
from pprint import pprint
import asyncio
from argparse import ArgumentParser

from mmdet.apis import (async_inference_detector, inference_detector,
                        init_detector, show_result_pyplot)
import mmcv
import mmcv_custom  # noqa: F401,F403
import mmdet_custom  # noqa: F401,F403
import os.path as osp


def compress(frames_objs):
  class_names = ['Vehicles and Transportation',
                 'Traffic and Infrastructure',
                 'Animals',
                 'People and Personal Items',
                 'Sports and Recreation',
                 'Kitchenware',
                 'Food and Beverages',
                 'Furniture and Home Items',
                 'Electronics and Appliances',
                 'Dog',
                 'Cat',
                 'Person',
                 'Airplane',
                 'Boat',
                 'Cell phone',
                 'Bottle',
                 'Bicycle']
  ret = []
  for frame in frames_objs:
    ret.append({'frame_id':frame['frame_id'], 'objs':[]})

    compress_objs = [{'name':class_names[i], 'bboxs':[]} for i in range(len(class_names))]

    for i in range(len(frame['objs'])):
      if i<1:
        for bbox in frame['objs'][i]['bboxs']:
          compress_objs[11]['bboxs'].append(bbox)
          compress_objs[3]['bboxs'].append(bbox)

      if 1<=i and i<9:
        for bbox in frame['objs'][i]['bboxs']:
          compress_objs[0]['bboxs'].append(bbox)

      if 9<=i and i<14:
        for bbox in frame['objs'][i]['bboxs']:
          compress_objs[1]['bboxs'].append(bbox)

      if 14<=i and i<24:
        for bbox in frame['objs'][i]['bboxs']:
          compress_objs[2]['bboxs'].append(bbox)

      if 24<=i and i<29:
        for bbox in frame['objs'][i]['bboxs']:
          compress_objs[3]['bboxs'].append(bbox)

      if 29<=i and i<39:
        for bbox in frame['objs'][i]['bboxs']:
          compress_objs[4]['bboxs'].append(bbox)

      if 39<=i and i<46:
        for bbox in frame['objs'][i]['bboxs']:
          compress_objs[5]['bboxs'].append(bbox)

      if 46<=i and i<56:
        for bbox in frame['objs'][i]['bboxs']:
          compress_objs[6]['bboxs'].append(bbox)

      if 56<=i and i<62:
        for bbox in frame['objs'][i]['bboxs']:
          compress_objs[7]['bboxs'].append(bbox)

      if 63<=i and i<73:
        for bbox in frame['objs'][i]['bboxs']:
          compress_objs[8]['bboxs'].append(bbox)

      if 73<=i and i<77:
        for bbox in frame['objs'][i]['bboxs']:
          compress_objs[7]['bboxs'].append(bbox)

      if 77<=i and i<80:
        for bbox in frame['objs'][i]['bboxs']:
          compress_objs[3]['bboxs'].append(bbox)

      if i==16:
        for bbox in frame['objs'][16]['bboxs']:
          compress_objs[9]['bboxs'].append(bbox)

      if i==15:
        for bbox in frame['objs'][15]['bboxs']:
          compress_objs[10]['bboxs'].append(bbox)

      if i==4:
        for bbox in frame['objs'][4]['bboxs']:
          compress_objs[12]['bboxs'].append(bbox)

      if i==8:
        for bbox in frame['objs'][8]['bboxs']:
          compress_objs[13]['bboxs'].append(bbox)

      if i==67:
        for bbox in frame['objs'][67]['bboxs']:
          compress_objs[14]['bboxs'].append(bbox)

      if i==39:
        for bbox in frame['objs'][39]['bboxs']:
          compress_objs[15]['bboxs'].append(bbox)

      if i==1:
        for bbox in frame['objs'][1]['bboxs']:
          compress_objs[16]['bboxs'].append(bbox)

      ret[-1]['objs'] = compress_objs
  return ret

import json 
   
def save_json(frames_objs, out_file):
  # Convert and write JSON object to file
  with open(out_file, "w") as outfile: 
      json.dump(frames_objs, outfile, indent=4)

def detect(config, checkpoint, imgs_path, out):
    coco_classes = {0: '__background__', 1: 'person', 2: 'bicycle', 3: 'car', 4: 'motorcycle', 5: 'airplane', 6: 'bus', 7: 'train', 8: 'truck', 9: 'boat', 10: 'traffic light', 11: 'fire hydrant', 12: 'stop sign', 13: 'parking meter', 14: 'bench', 15: 'bird', 16: 'cat', 17: 'dog', 18: 'horse', 19: 'sheep', 20: 'cow', 21: 'elephant', 22: 'bear', 23: 'zebra', 24: 'giraffe', 25: 'backpack', 26: 'umbrella', 27: 'handbag', 28: 'tie', 29: 'suitcase', 30: 'frisbee', 31: 'skis', 32: 'snowboard', 33: 'sports ball', 34: 'kite', 35: 'baseball bat', 36: 'baseball glove', 37: 'skateboard', 38: 'surfboard', 39: 'tennis racket', 40: 'bottle', 41: 'wine glass', 42: 'cup', 43: 'fork', 44: 'knife', 45: 'spoon', 46: 'bowl', 47: 'banana', 48: 'apple', 49: 'sandwich', 50: 'orange', 51: 'broccoli', 52: 'carrot', 53: 'hot dog', 54: 'pizza', 55: 'donut', 56: 'cake', 57: 'chair', 58: 'couch', 59: 'potted plant', 60: 'bed', 61: 'dining table', 62: 'toilet', 63: 'tv', 64: 'laptop', 65: 'mouse', 66: 'remote', 67: 'keyboard', 68: 'cell phone', 69: 'microwave', 70: 'oven', 71: 'toaster', 72: 'sink', 73: 'refrigerator', 74: 'book', 75: 'clock', 76: 'vase', 77: 'scissors', 78: 'teddy bear', 79: 'hair drier', 80: 'toothbrush'}
    device = 'cuda:0'
    
    img_names = os.listdir(imgs_path)
    imgs = [os.path.join(imgs_path, img_name) for img_name in img_names]
    score_thr = 0.3
    palette = 'coco'

    # build the model from a config file and a checkpoint file
    model = init_detector(config, checkpoint, device=device)
    # test a single image
    results = inference_detector(model, imgs)

    mmcv.mkdir_or_exist(out)
    out_file = osp.join(out, "result.json")

    ret = []
    for i in range(len(results)):
        result = results[i][0]
        objs = []
        for class_id in range(len(result)):
            bboxs = []
            for bbox in result[class_id].tolist():
                if (bbox[-1] >= score_thr):
                    bboxs.append(bbox[0:4])

            objs.append({'name': coco_classes[class_id+1], 'bboxs':bboxs})

        ret.append({'frame_id' : img_names[i].split('.')[0],
                'objs': objs})
    # pprint(ret)
    return save_json(compress(ret), out_file)

def parse_args():
    parser = ArgumentParser()
    parser.add_argument('imgs_path',type=str, help='Image file')
    parser.add_argument('config', help='Config file')
    parser.add_argument('checkpoint', help='Checkpoint file')
    parser.add_argument('--out', type=str, default="", help='out dir')
    args = parser.parse_args()
    return args


def main(args):
  detect(args.config,
        args.checkpoint,
        args.imgs_path,
        args.out)

if __name__ == '__main__':
    args = parse_args()
    main(args)