<h1 align="center">DeepSolo++: Let Transformer Decoder with Explicit Points Solo for Multilingual Text Spotting</h1> 



## Checkpoints

|Version|Pretrained weights|Finetuned Weights|
|:------:|:------:|:------:|
|Res-50, routing, #1| [OneDrive](https://1drv.ms/u/s!AimBgYV7JjTlgcwYxWkWMGz6y4XFYQ?e=5HdB0S) | [OneDrive](https://1drv.ms/u/s!AimBgYV7JjTlgcwZNWXa6BwI-R6SAQ?e=kEOoBQ) (MLT19 Task4 H-mean: 50.3) |

## Usage

- ### Installation

Python 3.8 + PyTorch 1.9.0 + CUDA 11.1 + Detectron2 (v0.6)
```
git clone https://github.com/Ly-Lynn/AIC_Video-Retrieval/

cd BE/DeepSolo/

docker build -t deepsolopp .

docker run -v {your local dir to DeepSolo}:/deepsolo/ --gpus all -it --name deepsolopp deepsolopp

python setup.py build develop
```

- ### Visualization Demo
```
python demo/demo.py --config-file configs/R_50/mlt19_multihead/finetune.yaml --input ${IMAGES_FOLDER} --output ${OUTPUT_PATH} --opts MODEL.WEIGHTS <MODEL_PATH>
```
**For example**
```
python demo/demo.py --config-file /deepsolo/configs/R_50/mlt19_multihead/finetune.yaml --input /deepsolo/test_imgs --output /deepsolo/outputs --opts MODEL.WEIGHTS /deepsolo/pretrained_model/r50_data3_multilingual_pretrain.pth  
```

## Citation

```bibtex
@article{ye2023deepsolo++,
  title={DeepSolo++: Let Transformer Decoder with Explicit Points Solo for Multilingual Text Spotting},
  author={Ye, Maoyuan and Zhang, Jing and Zhao, Shanshan and Liu, Juhua and Liu, Tongliang and Du, Bo and Tao, Dacheng},
  booktitle={arxiv preprint arXiv:2305.19957},
  year={2023}
}
```
