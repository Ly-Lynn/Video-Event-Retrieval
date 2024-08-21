import cv2
import numpy as np
import os
from tqdm import tqdm
from skimage.metrics import structural_similarity as compute_ssim
from sklearn.metrics.pairwise import cosine_similarity
from keras.applications.vgg16 import VGG16, preprocess_input
from keras.models import Model

