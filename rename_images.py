import os
import re

dir_path = 'xiaoming'
files = os.listdir(dir_path)

# 支持的图片格式
IMAGE_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp', '.svg')

# 处理所有支持的图片格式
image_files = [f for f in files if os.path.splitext(f)[1].lower() in IMAGE_EXTENSIONS]

# 按时间戳排序
image_files.sort(key=lambda x: re.findall(r'\d+', x)[0])

# 重命名文件
for i, old_name in enumerate(image_files, 1):
    # 保持原始文件扩展名
    ext = os.path.splitext(old_name)[1]
    new_name = f'image_{str(i).zfill(3)}{ext}'
    old_path = os.path.join(dir_path, old_name)
    new_path = os.path.join(dir_path, new_name)
    os.rename(old_path, new_path)
    print(f'Renamed {old_name} to {new_name}')