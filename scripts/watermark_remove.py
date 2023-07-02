#!/../utility-tools-env/Scripts/python
import sys
import os
from PIL import Image
import time


def remove_watermark(img_path, result_path, grayscale_min, grayscale_max):
    if not os.path.exists(result_path):
        os.makedirs(result_path)

    image_files = [file for file in os.listdir(
        img_path) if file.endswith('.jpg')]

    for file in image_files:
        image_path = os.path.join(img_path, file)
        image = Image.open(image_path).convert('L')
        image = image.point(lambda p: 255 if p >
                            grayscale_max else 0 if p < grayscale_min else p)

        new_image_path = os.path.join(result_path, file)
        image.save(new_image_path)


if len(sys.argv) < 5:
    print("Usage: python watermark_remove.py <input_path> <output_path> <grayscale_min> <grayscale_max>")
    sys.exit(1)

img_path = sys.argv[1]
result_path = sys.argv[2]
grayscale_min = int(sys.argv[3])
grayscale_max = int(sys.argv[4])

remove_watermark(img_path, result_path, grayscale_min, grayscale_max)
