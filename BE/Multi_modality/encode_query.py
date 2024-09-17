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
# intern_model.to('cpu')

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


all_feat = torch.load("/mnt/mmlab2024/datasets/thi/final_tensors.pt")


# def compute_scores(text, sorting=True): 
#   global intern_model
#   intern_model = intern_model.to('cuda')
#   text_fea = encode_query(text).to('cuda')

#   global all_feat
#   all_feat = all_feat.to('cuda')

#   with torch.no_grad():
#     # label_probs = (100.0 *  text_fea @ all_feat.T).softmax(dim=-1).detach().cpu()# shape: (1, 1061162)
#     label_probs = (100.0 *  text_fea @ all_feat.T).detach().cpu()# shape: (1, 1061162)
#     label_probs = label_probs[0]  # shape: (1061162)

#   intern_model.to('cpu')
#   all_feat = all_feat.to('cpu')
  
#   if sorting:
#     sorted_probs, indices = torch.sort(label_probs, descending=True)
#     return sorted_probs, indices.tolist()

#   return label_probs

with open("/mnt/mmlab2024/datasets/thi/key_index.txt", 'r') as r:
  key_f = r.read().split('\n')


def compute_scores(text): 
  global intern_model
  # intern_model = intern_model.to('cuda')
  text_fea = encode_query(text).to('cuda')

  global all_feat
  # all_feat = all_feat.to('cuda')

  with torch.no_grad():
    # label_probs = (100.0 *  text_fea @ all_feat.T).softmax(dim=-1).detach().cpu()# shape: (1, 1061162)
    label_probs = (100.0 *  text_fea @ all_feat.T).detach().cpu()# shape: (1, 1061162)
    label_probs = label_probs[0].tolist()  # shape: (1061162)

  intern_model.to('cpu')
  all_feat = all_feat.to('cpu')

  final_res = [
    { "_index": "frames",
    "_id": key_f[i],
    "_score": label_probs[i]
    } 
  for i in range(len(label_probs))]

  print(final_res)
  return final_res


def get_top_k(text, k=100):
  global intern_model
  intern_model.to('cuda')
  text_fea = encode_query(text).to('cuda')
  
  global all_feat
  all_feat = all_feat.to('cuda')

  label_probs = (100.0 *  text_fea @ all_feat.T).softmax(dim=-1)
  top_probs, top_labels = label_probs.float().cpu().topk(k, dim=-1)

  intern_model.to('cpu')
  all_feat = all_feat.to('cpu')

  return top_probs[0], top_labels[0]






# # Usage

# import time
# t1 = time.time()
# top_probs = compute_scores("A person is being interviewed. Behind this person, the wall is decorated with many shark teeth.")
# t2 = time.time()

# print(t2 - t1)
# for i in top_labels:
#   print(key_f[i])