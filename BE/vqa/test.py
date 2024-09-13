import torch
from PIL import Image
from transformers import AutoModel, AutoTokenizer


vqa_model = AutoModel.from_pretrained('openbmb/MiniCPM-Llama3-V-2_5', trust_remote_code=True, torch_dtype=torch.float16, cache_dir='/mnt/mmlab2024/datasets/conda/cache')
vqa_model = vqa_model.to(device='cpu')

tokenizer = AutoTokenizer.from_pretrained('openbmb/MiniCPM-Llama3-V-2_5', trust_remote_code=True)
vqa_model.eval()


def get_answer(image_link, question):
    global vqa_model
    
    image = Image.open(image_link).convert('RGB')
    vqa_model = vqa_model.to(device='cuda')

    msgs = [{'role': 'user', 'content': question}]
    res = vqa_model.chat(
        image=image,
        msgs=msgs,
        tokenizer=tokenizer,
        sampling=True, # if sampling=False, beam_search will be used by default
        temperature=0.7,
        # system_prompt='' # pass system_prompt if needed
    )

    # ## if you want to use streaming, please make sure sampling=True and stream=True
    # ## the vqa_model.chat will return a generator
    # res = vqa_model.chat(
    #     image=image,
    #     msgs=msgs,
    #     tokenizer=tokenizer,
    #     sampling=True,
    #     temperature=0.7,
    #     stream=True
    # )

    # generated_text = ""
    # for new_text in res:
    #     generated_text += new_text
    #     print(new_text, flush=True, end='')
    #     print('-----------------------------')
    
    vqa_model = vqa_model.to('cpu')
    return res


import time
t1 = time.time()
image_link = '/mnt/mmlab2024/nthy/Video/Videos_L03/video/L03_V018/L03_V018_023570.jpg'
question = 'What is in the image?'
t2 = time.time()
print(get_answer(image_link, question))
print(t2 - t1)