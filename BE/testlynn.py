import os
import base64
import io
import numpy as np
from PIL import Image

def encode64(np_img):
    '''
    Input: ảnh dạng numpy array 
    Return: Encode image thành dạng base64
    '''
    np_img = Image.fromarray(np_img.astype('uint8'))
    buffered = io.BytesIO()
    np_img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str


img_path = r'D:\codePJ\AIC\FE\aic\FE\public\test_imgs\img3.png'
img = Image.open(img_path)
img = np.array(img)

encoded = encode64(img)
print(encoded)