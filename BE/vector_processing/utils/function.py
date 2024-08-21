from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel
from .import clip_manager
import cv2
import numpy as np
import os
from tqdm import tqdm
from skimage.metrics import structural_similarity as compute_ssim
from sklearn.metrics.pairwise import cosine_similarity
from keras.applications.vgg16 import VGG16, preprocess_input
from keras.models import Model

def get_image_embedding(input):
    '''
    This fuction will be changed in the future
    '''
    if isinstance(input, str) and os.path.isfile(input):
        image = Image.open(input)
    elif isinstance(input, Image.Image):
        image = input
    elif isinstance(input, np.ndarray):
        image = Image.fromarray(cv2.cvtColor(input, cv2.COLOR_BGR2RGB))
    else:
        raise ValueError("Input must be a valid image path, an Image object, or a NumPy array")
    
    inputs = clip_manager.processor(images=image, return_tensors="pt", padding=True)
    with torch.no_grad():
        image_features = clip_manager.model.get_image_features(**inputs)
    return image_features[0].cpu().numpy()

def get_text_vector(text:str):
    '''
    ????
    '''
    inputs = clip_manager.processor(text=text, return_tensors="pt", padding=True)
    with torch.no_grad():
        text_features = clip_manager.model.get_text_features(**inputs)
    return text_features[0].cpu().numpy()

def vector_similarity(v1, v2):
    return cosine_similarity(v1.reshape(1, -1), v2.reshape(1, -1))