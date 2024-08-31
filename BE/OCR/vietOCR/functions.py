import json
import os
from tqdm import tqdm
from PIL import Image
from vietocr.tool.predictor import Predictor
from vietocr.tool.config import Cfg

cfg = Cfg.load_config_from_name('vgg_transformer')
cfg['device'] = 'cpu'
predictor = Predictor(cfg)

def text_recog (folder_path, output_path):
    vid_paths = [os.path.join(folder_path, fname) for fname in os.listdir(folder_path)]
    final_res = []
    for vid_path in tqdm(vid_paths, desc='Processing Videos'):
        vid_name = os.path.basename(vid_path)
        frames = os.listdir(vid_path)
        for fr in tqdm(frames, colour='green', desc='Frames in each vid', leave=False):
            fr_path = os.path.join(vid_path, fr)
            reg_res = []
            if fr != 'det_res':
                for det in tqdm(os.listdir(fr_path), leave=False):
                    det_path = os.path.join(fr_path, det)
                    reg = predictor.predict(Image.open(det_path))
                    reg_res.append(reg)
                final_res.append({
                    'frame_id': vid_name+os.path.basename(fr_path),
                    'ocr': reg_res
                })
    output_file = os.path.join(output_path, "ocr_results.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_res, f, ensure_ascii=False, indent=4)

if __name__ == '__main__':
    text_recog(r'D:\codePJ\AIC\FE\aic\BE\OCR\DeepSolo\outputs', r'D:\codePJ\AIC\FE\aic\BE\OCR\vietOCR')
