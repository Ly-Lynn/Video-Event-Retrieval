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
# Open React Project 
* **Builds** the app for production to the `FE` folder.
    ```
    cd FE
    npm run build
    ```
* **Runs** the app in the development mode.
    ```
    npm start
    ``` 
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.