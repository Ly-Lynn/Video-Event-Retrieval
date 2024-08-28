import pathlib
import torch
from tqdm import tqdm

def check(inp):
  inp = pathlib.Path(inp)
  t = 0
  for i in tqdm(list(inp.rglob('*.pt'))):
    t += torch.load(str(i)).shape[0]
  print(t)

check('/mnt/mmlab2024/datasets/thi/image_vectors')