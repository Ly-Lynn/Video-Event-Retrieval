import sys
import os
import glob
import tqdm

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import milvus.config
from milvus.utils.function import *

root_dir = r'/mnt/mmlab2024/datasets/thi/image_vectors'

txt_files = glob.glob(os.path.join(root_dir, '**/*.txt'), recursive=True)

pt_files = glob.glob(os.path.join(root_dir, '**/*.pt'), recursive=True)

assert len(txt_files) == len(pt_files), "Số lượng file .txt và .pt không khớp nhau."

for i in tqdm(range(len(pt_files)), desc="Processing files"):
    pt_file_path = pt_files[i]
    txt_file_path = txt_files[i]

    vector_list = torch.load(pt_file_path)

    with open(txt_file_path, 'r') as file:
        lines = file.readlines()        
    lines = [line.strip() for line in lines]

    for j in range(len(lines)):
        vector = vector_list[j]
        img_path = str(lines[j])

        add_vector_to_db(vector, "image_collection", img_path)