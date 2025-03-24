import os
import json

# 获取xiaoming文件夹中的所有图片
image_dir = 'xiaoming'
image_files = [f for f in os.listdir(image_dir) if f.endswith(('.jpg', '.jpeg', '.png', '.webp'))]

# 生成图片列表JSON文件
with open('images.json', 'w', encoding='utf-8') as f:
    json.dump({'images': image_files}, f, ensure_ascii=False, indent=2)