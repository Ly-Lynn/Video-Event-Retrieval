import torch
import numpy as np
import matplotlib.pyplot as plt

from vector_processing import clip_manager
from vector_processing.utils.function import *
from .import first_collection_constant
from PIL import Image
from pymilvus import Collection, connections, utility
from pymilvus import CollectionSchema, FieldSchema, DataType

global_metric_type = first_collection_constant.metric_type
collection_1_name = first_collection_constant.collection_name

def check_collection_exists(collection_name:str) -> bool:
    '''
    True: Exist
    False: Not exist
    '''
    if utility.has_collection(collection_name):
        print(f"Collection {collection_name} already exists.")
        return True
    else:
        print(f"Collection {collection_name} is not exists.")
        return False


def create_first_collection():
    '''
    Because writting a function for general creating collection is very hard
    This function is one bad and instant solution
    This one close to the application data architecture
    '''
    collection_name = collection_1_name
    
    if check_collection_exists(collection_name):
        print(f"Collection {collection_name} already exists.")
        return
    else:
        fields = [
            FieldSchema(name='image_id', dtype=DataType.INT64, is_primary=True, auto_id=True),
            FieldSchema(name='image_embedding', dtype=DataType.FLOAT_VECTOR, dim=512),
            FieldSchema(name='image_path', dtype=DataType.VARCHAR, max_length=255)
        ]
        schema = CollectionSchema(fields, description="Image embeddings")
        collection = Collection(name=collection_name, schema=schema)
        print(f"Created collection {collection_name}.")


def drop_collection(collection_name:str):
    if utility.has_collection(collection_name):
        collection = Collection(name=collection_name)
        
        collection.drop()
        print(f"Collection {collection_name} dropped.")
    else:
        print(f"Collection {collection_name} does not exist.")


def add_image_to_db(image_path:str, collection_name:str):
    embedding = get_image_embedding(image_path)
    
    collection = Collection(name=collection_name)
    
    entities = [
        [embedding.tolist()],  # image_embedding (FLOAT_VECTOR)
        [image_path]  # image_path (VARCHAR)
    ]
    
    collection.insert(entities)
    print(f"Added image {image_path} to database.")


def add_vector_to_db(vector, collection_name:str, image_path:str):
    print("Running")

    collection = Collection(name=collection_name)

    entities = [
        [vector.tolist()],  # image_embedding (FLOAT_VECTOR)
        [image_path]  # image_path (VARCHAR)
    ]

    collection.insert(entities)
    print(f"Added image {image_path} to database.")


def check_collection_schema(collection_name:str):
    collection = Collection(name=collection_name)
    schema = collection.schema
    print("Collection Schema:")
    for field in schema.fields:
        print(f"Field name: {field.name}, type: {field.dtype}")


def create_index(collection_name:str, index_type="IVF_FLAT", nlist=16384, metric_type="L2"):
    '''
    Create index of collection provided
    - Index type: Inverted File (default) (approximate nearest neighbor search)
    - Nlist: High value can increase the accuracy but the excecute time may increase too
    - Metric: L2 (default), IP: Inner Product, .....
    '''

    global global_metric_type

    if metric_type != global_metric_type:
        global_metric_type = metric_type

    collection = Collection(name=collection_name)
    index_params = {
        "index_type": index_type,
        "params": {"nlist": nlist},
        "metric_type": metric_type
    }
    
    collection.create_index(field_name="image_embedding", index_params=index_params)
    print(f"Index created for collection {collection_name}.")


def load_collection(collection_name:str):
    if check_collection_exists(collection_name):
        collection = Collection(name=collection_name)
        collection.load()
        print(f"Collection {collection_name} loaded into memory.")
    else:
        print(f"Cannot load collection {collection_name} because it does not exist.")


def print_collection_data(collection_name:str, field_1="image_path", field_2="image_id"):
    '''
    This function just only give result in two fields
    '''
    collection = Collection(name=collection_name)

    load_collection(collection_name)

    results = collection.query(expr="image_id >= 1", output_fields=[field_1, field_2])
    for result in results:
        print(result)


def search_result_in_collection_1(text_query:str, metric_type=None, nprobe=10):
    '''
    This function only use for collection 1
    '''

    global global_metric_type

    if metric_type == None:
        metric_type = global_metric_type

    if metric_type != global_metric_type:
        raise ValueError(f"Metric type '{metric_type}' does not match the expected metric type '{global_metric_type}' for this operation.")

    text_embedding = get_text_vector(text_query)

    collection = Collection(name=collection_1_name)
    search_params = {
        "metric_type": metric_type,
        "params": {"nprobe": nprobe}
    }
    results = collection.search([text_embedding], "image_embedding", search_params, limit=5)

    print("Top results:")
    for result in results[0]:
        entity = collection.query(expr=f"image_id == {result.id}", output_fields=["image_path"])
        if entity:
            image_path = entity[0]['image_path']
            print(f"Distance: {result.distance}, Image path: {image_path}")
            try:
                img = Image.open(image_path)
                plt.imshow(img)
                plt.title(f"Distance: {result.distance}")
                plt.axis('off')
                plt.show()
            except Exception as e:
                print(f"Error loading image {image_path}: {e}")
        else:
            print(f"No valid image path found for result with distance: {result.distance}")