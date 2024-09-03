from encode_query import encode_query
import sys
import os
import glob
import tqdm

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import milvus.config
from milvus.utils.function import *


# create_index('image_collection', metric_type='L2')

load_collection('image_collection')

print("Results")
print(search_query("A dog"))


# print(encode_query("abc").cpu().numpy()[0].tolist())

