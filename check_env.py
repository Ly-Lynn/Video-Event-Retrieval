import torch
import torchvision
import torchaudio
import transformers
import flask
import importlib.metadata
import pymilvus
import matplotlib

# Print versions
print("Torch version:", torch.__version__)
print("Torchvision version:", torchvision.__version__)
print("Torchaudio version:", torchaudio.__version__)
print("Transformers version:", transformers.__version__)
print("Flask version:", importlib.metadata.version("flask"))
print("Milvus version:", pymilvus.__version__)
print("Matplotlib version:", matplotlib.__version__)
