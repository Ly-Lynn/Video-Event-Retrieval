# Đọc file và lưu mỗi dòng thành phần tử của danh sách
with open('/mnt/mmlab2024/datasets/thi/image_vectors/Videos_L01/video/L01_V001/L01_V001.txt', 'r') as file:
    lines = file.readlines()

# Loại bỏ ký tự xuống dòng '\n' khỏi mỗi dòng (tùy chọn)
lines = [line.strip() for line in lines]

print(lines[0])
