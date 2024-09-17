from pprint import pprint

def call_distance(frame1, frame2):
  '''
  call distance between two frame
  '''
  if (frame1[0] != frame2[0]):
    return -1
  else:
    return abs(frame1[1] - frame2[1])


def get_frame_id(frame):
  return frame[1]


def sort_by_frame_id(frames):
  '''
  sort queries by frame id
  '''
  frames.sort(key=get_frame_id)


def get_n_videos(queries_frames):
  '''
  get number of videos
  '''
  video_names = []
  for query_frames in queries_frames:
    for frame in query_frames:
      if frame[0] not in video_names:
        video_names.append(frame[0])
  return len(video_names)


def get_inv_video_id(queries_frames):
  '''
  create inverted index and index of video names
  '''
  video_names = []

  for query_frames in queries_frames:
    for frame in query_frames:
      if frame[0] not in video_names:
        video_names.append(frame[0])
  video_names.sort()

  inv_video_id = dict()
  for i in range(len(video_names)):
    inv_video_id[video_names[i]] = i
  
  return video_names, inv_video_id


def video_id_to_index(queries_frames, inv_video_id):
  '''
  convert the index of video into video id
  '''
  ret = []
  for i in range (len(queries_frames)):
    ret.append([])
    for j in range (len(queries_frames[i])):
      ret[i].append((inv_video_id[queries_frames[i][j][0]], queries_frames[i][j][1], queries_frames[i][j][2]));
       
  return ret


def split_by_video_id(queries_frames, ):
  '''
  give a list of queries frames
  return a list of queries frames q[i][j] split by video id
    i: the query id
    j: the video id
  '''
  max_video_id = get_n_videos(queries_frames)
  queries_frames_by_video_id = [[[] for i in range(max_video_id+1)] for i in range(len(queries_frames))]

  for query_id in range(len(queries_frames)):
    query_frames = queries_frames[query_id]
    for frame in query_frames:
      queries_frames_by_video_id[query_id][frame[0]].append(frame)

  return queries_frames_by_video_id


def calc_score(queries):
  '''
  calculate the score of given queries
  '''
  sum = 0
  for query in queries:
    sum += query[2]
  return sum


def get_closet_frames(splited_queries_frames, max_video_id, n_queries):
  '''
  return the index of closet frames for each video
  '''
  ret = []

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
      tmp = []
      for i in range(len(closet_index)):
        tmp.append(splited_queries_frames[i][video_id][closet_index[i]])
      ret.append(tmp)

  # sort ret
  ret.sort(
      key=lambda q:
        calc_score(q)  
    )

  return ret


def index_to_video_id(tuple_queries, video_names):
  ret = []
  for tuple_query in tuple_queries:
    ret.append([])
    for query in tuple_query:
      ret[-1].append((video_names[query[0]], query[1], query[2]))
  return ret


def remove_frames_score(tuple_queries):
  ret = []
  for tuple_query in tuple_queries:
    ret.append([])
    for query in tuple_query:
      ret[-1].append((query[0], query[1]))
  return ret


def combine_video_and_frame_id(tuple_queries):
  ret = []
  for tuple_query in tuple_queries:
    ret.append([])
    for query in tuple_query:
      ret[-1].append(query[0] + "_" + str(query[1]).zfill(6))
  return ret


def sort_by_stages(retrieval_result):
  for query_frames in retrieval_result:
    sort_by_frame_id(query_frames)

  n_video = get_n_videos(retrieval_result)
  n_query = len(retrieval_result)
  video_names, inv_video_id = get_inv_video_id(retrieval_result)
  retrieval_result = video_id_to_index(retrieval_result, inv_video_id)
  
  splited_result = split_by_video_id(retrieval_result)

  result = get_closet_frames(splited_result, n_video, n_query)
  result = index_to_video_id(result, video_names)
  result = remove_frames_score(result)
  result = combine_video_and_frame_id(result)
  return result