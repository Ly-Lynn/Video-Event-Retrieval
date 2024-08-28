from pprint import pprint
import random

# generate sample for combine frame
# given n_frame and n_videos
# return a list q[i] each element have format (video id, frame id, retrival score)
def generate_query_frames(n_frames, n_videos):
    ret = []
    frame_id_max=1000

    for i in range(n_frames):
        frame_id = random.randint(0,frame_id_max)
        video_id = random.randint(0,n_videos-1)
        retrieval_score = random.randint(0,1000)
        ret.append((video_id, frame_id, retrieval_score))

    return ret

# call distance between two frame
def call_distance(frame1, frame2):
    if (frame1[0] != frame2[0]):
        return -1
    else:
        return abs(frame1[1] - frame2[1])
def get_frame_id(frame):
    return frame[1]   

def sort_by_frame_id(frames):
    frames.sort(key=get_frame_id)
# get max video_id in the queries frames
def get_max_video_id(queries_frames):
    max_video_id = 0

    for query_frames in queries_frames:
        for frame in query_frames:
            max_video_id = max(max_video_id, frame[0])

    return max_video_id

# give a list of queries frames
# return a list of queries frames q[i][j] split by video id
#   i: the query id
#   j: the video id
def split_by_video_id(queries_frames):
    max_video_id = get_max_video_id(queries_frames)
    queries_frames_by_video_id = [[[] for i in range(max_video_id+1)] for i in range(len(queries_frames))]

    for query_id in range(len(queries_frames)):
        query_frames = queries_frames[query_id]
        for frame in query_frames:
            queries_frames_by_video_id[query_id][frame[0]].append(frame)

    return queries_frames_by_video_id

# search by frame id give a list of frames
# return the frame_id of the first element greater or equal frame_id
def binary_search(frames, frame_id):
    l, r = 0, len(frames)-1
    mid = -1
    while (l<=r):
        mid = (l+r)//2

        if (frames[mid][1] == frame_id):
            return mid

        elif (frames[mid][1] > frame_id):
            r = mid-1

        else:
            l = mid+1
    return mid

def calc_queries_distance(e):
  return

# return the index of closet frames for each video
def frames_sorting(splited_queries_frames, max_video_id, n_queries):
  ret = [[] for i in range(max_video_id + 1)]

  for video_id in range(max_video_id + 1):
    cur_index = [0 for i in range(n_queries)]
    closet_index = cur_index.copy()
    minDist = 1e9
    failed = False

    first_queries_frames_len = len(splited_queries_frames[0][video_id])

    while (cur_index[0] < first_queries_frames_len):
      last_frame = splited_queries_frames[0][video_id][cur_index[0]][1]

      for query_id in range(n_queries):
        if (cur_index[query_id] >= len(splited_queries_frames[query_id][video_id])):
            failed = True
            break

        cur_frame = splited_queries_frames[query_id][video_id][cur_index[query_id]][1]

        while (cur_frame < last_frame):
          cur_index[query_id] += 1
          if (cur_index[query_id] >= len(splited_queries_frames[query_id][video_id])):
            failed = True
            break

          cur_frame = splited_queries_frames[query_id][video_id][cur_index[query_id]][1]

          if (failed == True):
            break

        last_frame = cur_frame

        if (failed == True):
          break

      if (failed == True):
        break
      frame1 = splited_queries_frames[0][video_id][cur_index[0]]
      frame2 = splited_queries_frames[-1][video_id][cur_index[-1]]
      dist = call_distance(frame1, frame2)
      if (dist < minDist):
        minDist = dist
        closet_index = cur_index.copy()

      cur_index[0] += 1

      ret[video_id].append(closet_index)

    # sort ret
    for i in range(max_video_id + 1):
      ret[video_id].sort(
        key=lambda q:
        call_distance(
            splited_queries_frames[0][video_id][q[0]],
            splited_queries_frames[-1][video_id][q[-1]])
      )

  return ret