FROM cnstark/pytorch:1.11.0-py3.9.12-cuda11.3.1-devel-ubuntu20.04
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /internimage

COPY . /internimage/
RUN apt-get update && \
    apt-get install -y \
    git-all \
    pip &&\
    ln -fs /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata 
RUN pip install -U openmim && \
    mim install mmcv-full==1.5.0 &&\
    pip install timm==0.6.11 mmdet==2.28.1 &&\
    pip install opencv-python termcolor yacs pyyaml scipy

# WORKDIR internimage/InternImage/detection/ops_dcnv3
# RUN sh make.sh &&\
#     python test.py
