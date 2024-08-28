from PIL import Image
import base64
import io

class Frame:
    def __init__(self, frame, frame_id, video, ocr_res, asr_res, od_res):
        '''
        frame: numpy array
        frame_id: string (6 chữ số)
        video: string
        ocr_res: list[string]
        asr_res: list[string]
        od_res: list[dict{'object','coordinates','conf'}]
        '''
        self.id = video+frame_id
        self.frame = frame
        self.frame_id = frame_id
        self.video = video
        self.ocr_res = ocr_res
        self.asr_res = asr_res
        self.od_res = od_res
    def get_frame(self):
        return self.frame_id, self.frame   
    def get_vector(self):
        return self.vector    
    def get_video_name(self):
        return self.video    
    def get_ocr_result(self):
        return self.ocr_res
    def get_asr_result(self):
        return self.asr_res
    def get_od_res(self):
        return self.od_res
    
    def encode64(self):
        '''
        Input: ảnh dạng numpy array 
        Return: Encode image thành dạng base64
        '''
        np_img = self.frame
        np_img = Image.fromarray(np_img.astype('uint8'))
        buffered = io.BytesIO()
        np_img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return img_str
    

    def __repr__(self):
        return (f"VideoFrame(video_name={self.video_name}, "
                f"ocr_result={self.ocr_result}, "
                f"asr_result={self.asr_result}, "
                f"od_res={self.object_detection_result})")