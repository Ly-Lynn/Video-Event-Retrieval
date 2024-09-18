import yaml

def load_yaml(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return yaml.safe_load(file)

configs = load_yaml("BE\configs\configs.yaml")
