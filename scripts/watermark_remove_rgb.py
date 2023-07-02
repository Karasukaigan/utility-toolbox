#!/../utility-tools-env/Scripts/python
import sys
import os
from PIL import Image
import time


def remove_watermark(img_path, result_path, r_value, g_value, b_value):
    if not os.path.exists(result_path):
        os.makedirs(result_path)
    image_files = [file for file in os.listdir(
        img_path) if file.endswith('.jpg')]

    for file in image_files:
        image_path = os.path.join(img_path, file)
        image = Image.open(image_path).convert('RGB')
        pix = image.load()
        width, height = image.size

        for x in range(width):
            for y in range(height):
                r, g, b = pix[x, y]
                if r + g + b >= r_value + g_value + b_value:
                    pix[x, y] = (255, 255, 255)

        new_image_path = os.path.join(result_path, file)
        image.save(new_image_path)


if len(sys.argv) < 6:
    print("Usage: python watermark_remove_rgb.py <input_path> <output_path> <r_value> <g_value> <b_value>")
    sys.exit(1)

img_path = sys.argv[1]
result_path = sys.argv[2]
r_value = int(sys.argv[3])
g_value = int(sys.argv[4])
b_value = int(sys.argv[5])

remove_watermark(img_path, result_path, r_value, g_value, b_value)
