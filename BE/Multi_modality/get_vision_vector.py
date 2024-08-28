import numpy as np
import torch


import numpy as np
import os
import io
import cv2

import torch

from demo.utils import (retrieve_text,
                  _frame_from_video,
                  setup_internvideo2)

from demo.config import (Config,
                    eval_dict_leaf)


import pathlib
import cv2
from tqdm import tqdm
import math
import argparse
import psutil
import sys


def avoid_OOM(percent=60):
  '''
  Avoid out of memory when map dataset
  '''
  memo = psutil.virtual_memory()
  if int(memo[2]) > percent:
    print(f"Memory reached {memo[2]}%, terminate to avoid out of memory")
    sys.exit(0)


def list_leaf_dirs(root_dir: pathlib.Path):
  root_dir = pathlib.Path(root_dir)
  leaf_dirs = []
  for path in root_dir.rglob("*"):
    if path.is_dir():
      is_leaf = True
      for i in path.iterdir():
        if i.is_dir():
          is_leaf = False
          break
      if is_leaf:
        leaf_dirs.append(path)
  
  return leaf_dirs

v_mean = np.array([0.485, 0.456, 0.406]).reshape(1,1,3)
v_std = np.array([0.229, 0.224, 0.225]).reshape(1,1,3)

def normalize(data):
    return (data/255.0-v_mean)/v_std

def frames2tensor(vid_list, fnum=8, target_size=(224, 224), device=torch.device('cpu')):
    assert(len(vid_list) >= fnum)
    step = len(vid_list) // fnum
    vid_list = vid_list[::step][:fnum]
    vid_list = [cv2.resize(x[:,:,::-1], target_size) for x in vid_list]
    vid_tube = [np.expand_dims(normalize(x), axis=(0, 1)) for x in vid_list]
    vid_tube = np.concatenate(vid_tube, axis=1)
    vid_tube = np.transpose(vid_tube, (0, 1, 4, 2, 3))
    vid_tube = torch.from_numpy(vid_tube).to(device, non_blocking=True).float()
    return vid_tube

def get_text_feat_dict(texts, clip, text_feat_d={}):
    for t in texts:
        feat = clip.get_txt_feat(t)
        text_feat_d[t] = feat
    return text_feat_d


config = Config.from_file('demo/internvideo2_stage2_config.py')
config = eval_dict_leaf(config)

model_pth = r'/mnt/mmlab2024/datasets/thi/AIC2024/InternVideo/InternVideo2-stage2_1b-224p-f4-002.pt'
config['pretrained_path'] = model_pth
print(config.model.text_encoder.name)

# intern_model, tokenizer = setup_internvideo2(config)
intern_model, _ = setup_internvideo2(config)



def get_vector(image_path, output_path, batch_size=64):
    image_path = pathlib.Path(image_path)
    output_path = pathlib.Path(output_path)

    images = []
    path = []

    print("\nReading image\n")
    for i in tqdm(sorted(list(image_path.iterdir()))):
        images.append(cv2.imread(str(i), cv2.IMREAD_COLOR))
        path.append(str(i))

    image_tensor = [frames2tensor(np.expand_dims(x, 0), fnum=1) for x in tqdm(images)]
    
    del images

    all_feat = None

    print("\nEncoding ... \n")
    for i in tqdm(range(math.ceil(len(image_tensor) / batch_size))):
        con_image_tensor = torch.concatenate(image_tensor[i*batch_size:(i+1)*batch_size], axis=0).to('cuda')
        if all_feat is None:
            all_feat = intern_model.get_vid_feat(con_image_tensor)
        else:
            all_feat = torch.cat((all_feat, intern_model.get_vid_feat(con_image_tensor)), dim=0)
    
    print(all_feat.shape)
    torch.save(all_feat, output_path / (image_path.name + '.pt'))

    with open(output_path / (image_path.name + '.txt'), 'w') as w:
        w.write('\n'.join(path))

    del all_feat
    del path
    
    print('\n---------------------------------------------\n')


def get_vector_all(root_path, root_output_path, batch_size):
    root_path = pathlib.Path(root_path)
    root_output_path = pathlib.Path(root_output_path)

    leafs = list_leaf_dirs(root_path)

    for i in sorted(leafs):
        output_path = pathlib.Path(str(i).replace(str(root_path), str(root_output_path)))
        if output_path.exists():
            print(f"Already encoded {i} and saved at {output_path}")
            print('\n---------------------------------------------\n')
            continue
        avoid_OOM()
        print(f"Encoding {i} and store at {output_path}")
        output_path.mkdir(parents=True)
        get_vector(i, output_path)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process some paths and batch size.')

    # Add arguments
    parser.add_argument('input_path', type=str, help='The path to the input file or directory.')
    parser.add_argument('output_path', type=str, help='The path to the output file or directory.')
    parser.add_argument('--batch_size', type=int, help='The batch size for processing.', default = 64)

    # Parse the arguments
    args = parser.parse_args()

    # Access the arguments
    input_path = pathlib.Path(args.input_path)
    output_path = pathlib.Path(args.output_path)
    batch_size = int(args.batch_size)

    get_vector_all(input_path, output_path, batch_size)
