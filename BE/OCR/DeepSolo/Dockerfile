FROM cnstark/pytorch:1.8.1-py3.9.12-cuda11.1.1-devel-ubuntu20.04
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /deepsolo

COPY . /deepsolo/
RUN apt-get update && \
    apt-get install -y \
        libatlas-base-dev \
        libblas3 \
        liblapack3 \
        liblapack-dev \
        libblas-dev \
        gfortran \
        libgl1-mesa-glx \
        tzdata \
        libglib2.0-0 \
        libsm6 \
        libxrender1 \
        libxext6 && \
    ln -fs /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata 
RUN pip install -r requirements.txt &&\
    python -m pip install -e detectron2
