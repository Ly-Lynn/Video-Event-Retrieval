from . import *
from vector_processing.utils.function import *
import pathlib
from tqdm import tqdm
import argparse


def select_keyframes(video_path:str, thres:float, output_path=str, step=10):
    video_name = os.path.basename(video_path).split(".")[0]
    K = None
    v_prev = None
    video_capture = cv2.VideoCapture(video_path)
    sim_score = []
    frame_count = int(video_capture.get(cv2.CAP_PROP_FRAME_COUNT))
    for frame_idx in tqdm(range(0, frame_count), desc="Processing video frames"):
        success, frame = video_capture.read()
        if not success:
            print("Failed to read frame")
            break
        if frame_idx % step == 0:
            fr_i = frame
            v_i = get_image_embedding(frame)
            if K is None:
                save_keyframe(fr_i, frame_idx, output_path, video_name)
                v_prev = v_i
                K = v_i
                continue
            if vector_similarity(v_i, v_prev) < thres or vector_similarity(K, v_i) < thres:
                save_keyframe(fr_i, frame_idx, output_path, video_name)
                sim_score.append([frame_idx, vector_similarity(v_i, v_prev),vector_similarity(K, v_i)])

                K = v_i
            v_prev = v_i
    video_capture.release()
    return K, sim_score

def save_keyframe(keyframe ,idx, output_folder_path, video_name:str):
    if not os.path.exists(output_folder_path):
        os.makedirs(output_folder_path)
    frame_filename = os.path.join(output_folder_path, f"{video_name}_{idx:06d}.png")
    cv2.imwrite(frame_filename, keyframe)


def keyframes_folder(root_video, root_output):
    root_video = pathlib.Path(root_video)
    root_output = pathlib.Path(root_output)

    videos = root_video.rglob("*.mp4")

    for processing_video in videos:
        output_video_path = pathlib.Path(str(processing_video.parent / processing_video.stem).replace(str(root_video), str(root_output)))

        if output_video_path.exists():
            print(f"Already get frame from {processing_video} and store at {output_video_path}, skip")
            continue

        print(f"Get frame from {processing_video} and store at {output_video_path}")
        output_video_path.mkdir(parents=True)
        select_keyframes(str(processing_video), 0.99, output_video_path)