from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel

class CLIPManager:
    def __init__(self):
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

class FirstCollectionConstant:
    def __init__(self, collection_name='image_collection', metric_type='L2') -> None:
        self.collection_name = collection_name
        self.metric_type = metric_type

clip_manager = CLIPManager()
first_collection_constant = FirstCollectionConstant()