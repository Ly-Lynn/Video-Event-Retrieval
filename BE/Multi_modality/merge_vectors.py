import pathlib
import tqdm
import torch
import argparse


def merge_vector_save(root : pathlib.Path, output_pt, output_txt):
  all_files = root.rglob("*.pt")

  all_feat = []
  all_key_f = []
  for pt_file in tqdm(list(all_files)):
    all_feat.append(torch.load(pt_file))
    txt_file = pt_file.parent / pt_file.stem + '.txt'
    with open(txt_file, 'r') as r:
      temp = r.read().split('\n')
      temp = [i.split('/')[-1][0:6] for i in temp]
      all_key_f += temp

  final_feat = torch.concatenate(all_feat)
  torch.save(final_feat, output_pt)
  with open(output_txt, 'w') as w:
    w.write('\n'.join(all_key_f))


if __name__ == "__main__":
  parser = argparse.ArgumentParser()
    
  # Add arguments for three paths
  parser.add_argument('tensors_path', type=str)
  parser.add_argument('output_pt_file', type=str)
  parser.add_argument('output_txt_file', type=str)

  # Parse arguments
  args = parser.parse_args()

  # Store paths in a list
  tensor_path = pathlib.Path(args.tensors_path)
  pt_path = args.output_pt_file
  output_txt = args.output_txt_file

  merge_vector_save()