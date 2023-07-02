#!/../utility-tools-env/Scripts/python
import sys
import os
import time
from pdf2image import convert_from_path
os.environ['PATH'] += os.pathsep + os.path.join(os.getcwd(), 'poppler-0.68.0', 'bin')


if len(sys.argv) < 3:
    print("Usage: python pdf2img.py <pdf_path> <output_path>")
    sys.exit(1)
pdf_path = sys.argv[1]
output_path = sys.argv[2]

def convert_pdf_to_images(pdf_path, output_path):
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    pages = convert_from_path(pdf_path, dpi=300, grayscale=False)

    for i, page in enumerate(pages):
        image_path = os.path.join(output_path, f'{i + 1:05d}.jpg')
        page.save(image_path, 'JPEG', quality=100)

convert_pdf_to_images(pdf_path, output_path)
