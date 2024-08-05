# Using Database Milvus

If you want to use Milvus database:

* **First**: You must download and install docker on your computer. [Tutorial](https://www.youtube.com/watch?v=XgRGI0Pw2mM&t=731s)
* **Second**: You must follow these command at root directory **<i>on Window PowerShell</i>**:

    * **Start** containers in docker file
    ```
    docker-compose up -d
    ```
    * **List** container
    ```
    docker ps -a
    ```
    * **Ensure** you have started these container before
    ```
    docker start $(docker ps -a -q)
    ```