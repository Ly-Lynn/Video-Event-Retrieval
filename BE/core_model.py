# import pandas as pd

# def call_core_model(query):
#   df = pd.read_csv(query)
#   video_name = df["video_name"].tolist()
#   index = df["index"].tolist()
#   key_f = [video_name[i] + '_' + str(index[i]).zfill(6) for i in range(len(video_name))]
#   score = df["score"].tolist()

#   final_res = [
#   { "_index": "frames",
#   "_id": key_f[i],
#   "_score": score[i]
#   } 
# for i in range(len(score))]
  
#   return final_res