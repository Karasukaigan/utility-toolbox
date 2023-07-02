#!/../utility-tools-env/Scripts/python
import sys
import os
import time
from fpdf import FPDF


def convert_images_to_pdf(img_path, pdf_name):
    image_files = sorted([file for file in os.listdir(img_path) if file.endswith('.jpg')])
    pdf = FPDF(format="A4")

    for file in image_files:
        image_path = os.path.join(img_path, file)
        pdf.add_page()
        pdf.image(image_path, 0, 0, pdf.w, pdf.h)

    pdf.output(pdf_name)


if len(sys.argv) < 3:
    print("Usage: python img2pdf.py <input_path> <output_path>")
    sys.exit(1)
img_path = sys.argv[1]
pdf_name = sys.argv[2]
output_path = os.path.join(pdf_name)
convert_images_to_pdf(img_path, output_path)