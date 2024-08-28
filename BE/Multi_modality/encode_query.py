import numpy as np
import torch


import numpy as np
import cv2

import torch

from demo.utils import (retrieve_text,
                  _frame_from_video,
                  setup_internvideo2)

from demo.config import (Config,
                    eval_dict_leaf)


v_mean = np.array([0.485, 0.456, 0.406]).reshape(1,1,3)
v_std = np.array([0.229, 0.224, 0.225]).reshape(1,1,3)

config = Config.from_file('demo/internvideo2_stage2_config.py')
config = eval_dict_leaf(config)

model_pth = r'/mnt/mmlab2024/datasets/thi/AIC2024/InternVideo2-stage2_1b-224p-f4-002.pt'
config['pretrained_path'] = model_pth
print(config.model.text_encoder.name)

intern_model, tokenizer = setup_internvideo2(config)


def get_text_feat_dict(texts, clip, text_feat_d={}):
    for t in texts:
      feat = clip.get_txt_feat(t)
      text_feat_d[t] = feat
    return text_feat_d


def encode_query(text):
  texts = [text]
  text_feat_d = {}
  text_feat_d = get_text_feat_dict(texts, intern_model, text_feat_d)
  text_feats = [text_feat_d[t] for t in texts]

  return text_feats[0]