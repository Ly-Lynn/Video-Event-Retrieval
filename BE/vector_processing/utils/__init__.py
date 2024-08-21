from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel

class CLIPManager:
    def __init__(self):
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

clip_manager = CLIPManager()