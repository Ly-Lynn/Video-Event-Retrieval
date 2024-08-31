from pymilvus import connections

# Establish connection to Milvus when this module is imported
host_name = 'localhost'
# Do not change it !
port = '19530'

def connect():
    connections.connect(host=host_name, port=port)

# Automatically establish connection when this module is imported
connect()

