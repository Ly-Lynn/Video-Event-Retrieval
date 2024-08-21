from PIL import Image
import torch

class FirstCollectionConstant:
    def __init__(self, collection_name='image_collection', metric_type='L2') -> None:
        self.collection_name = collection_name
        self.metric_type = metric_type

first_collection_constant = FirstCollectionConstant()