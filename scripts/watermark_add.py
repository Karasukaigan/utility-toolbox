#!/../utility-tools-env/Scripts/python
import sys
import os
from PIL import Image, ImageFont, ImageDraw, ImageColor


def add_watermark_image(img_path, result_path, watermark_path, watermark_layout):
    if not os.path.exists(result_path):
        os.makedirs(result_path)

    image_files = [file for file in os.listdir(img_path) if file.endswith('.jpg')]

    watermark_files = [file for file in os.listdir(watermark_path) if file.endswith('.png')]
    if watermark_files:
        watermark_image_path = os.path.join(watermark_path, watermark_files[0])
        watermark_image = Image.open(watermark_image_path).convert('RGBA')
    else:
        print("No watermark image found in the watermark path.")
        sys.exit(1)

    for file in image_files:
        image_path = os.path.join(img_path, file)
        image = Image.open(image_path)

        image = image.convert('RGBA')
        png_path = os.path.join(img_path, file.replace('.jpg', '.png'))
        image.save(png_path)

        if watermark_layout == 'stretch':
            # Stretch layout: Overlay the watermark image onto each image.
            image_with_watermark = image.resize(image.size)
            watermark_resized = watermark_image.resize(image.size)
            image_with_watermark.paste(watermark_resized, (0, 0), watermark_resized)

        elif watermark_layout == 'tile':
            # Tiled layout: Tile the watermark image onto each image.
            width, height = image.size
            watermark_width, watermark_height = watermark_image.size
            tile_columns = width // watermark_width + 1
            tile_rows = height // watermark_height + 1
            tiled_image = Image.new('RGBA', (width, height))

            for column in range(tile_columns):
                for row in range(tile_rows):
                    x = column * watermark_width
                    y = row * watermark_height
                    tiled_image.paste(watermark_image, (x, y))

            image_with_watermark = Image.alpha_composite(image.convert('RGBA'), tiled_image)

        elif watermark_layout == 'center':
            # Centered layout: Overlay the watermark image centered onto each image.
            image_with_watermark = image.copy()
            watermark_width, watermark_height = watermark_image.size
            x = (image.width - watermark_width) // 2
            y = (image.height - watermark_height) // 2
            image_with_watermark.paste(watermark_image, (x, y), watermark_image)

        elif watermark_layout == 'tilt':
            # Slanted layout: Overlay the rotated watermark image onto the center of each image.
            image_with_watermark = image.copy()
            watermark_rotated = watermark_image.rotate(40, expand=True)
            watermark_width, watermark_height = watermark_rotated.size
            x = (image.width - watermark_width) // 2
            y = (image.height - watermark_height) // 2
            image_with_watermark.paste(watermark_rotated, (x, y), watermark_rotated)

        else:
            print(f'Unknown watermark layout type: {watermark_layout}')
            continue

        new_image_path = os.path.join(result_path, file.replace('.png', '.jpg'))
        image_with_watermark.convert('RGB').save(new_image_path, quality=95)
        os.remove(png_path)


def add_watermark_text(img_path, result_path, watermark_text, watermark_layout):
    if not os.path.exists(result_path):
        os.makedirs(result_path)

    image_files = [file for file in os.listdir(img_path) if file.endswith('.jpg')]

    for file in image_files:
        image_path = os.path.join(img_path, file)
        image = Image.open(image_path)

        watermark_width = int(image.width * 2)
        watermark_height = int(image.height * 2)
        watermark_image = Image.new('RGBA', (watermark_width, watermark_height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(watermark_image)
        watermark_font_size = int(watermark_width * 0.05)
        watermark_font = ImageFont.truetype("public/font/Alimama_ShuHeiTi_Bold.ttf", watermark_font_size)
        watermark_fill_color = (0, 0, 0, 25)
        watermark_text_bbox = draw.textbbox((0, 0), watermark_text, font=watermark_font)
        watermark_text_width = watermark_text_bbox[2] - watermark_text_bbox[0]
        watermark_text_height = watermark_text_bbox[3] - watermark_text_bbox[1]
        offset_x = 0
        offset_y = 0
        for x in range(0, watermark_width, watermark_text_width + int(watermark_width * 0.1)):
            for y in range(0, watermark_height, watermark_text_height + int(watermark_width * 0.1)):
                draw.text((x + offset_x, y + offset_y), watermark_text, font=watermark_font, fill=watermark_fill_color)
                offset_x = watermark_text_width // 2 if offset_x == 0 else 0
        watermark_image_path = os.path.join("public/watermark-cache", "watermark.png")
        watermark_image.save(watermark_image_path)

        image = image.convert('RGBA')
        png_path = os.path.join(img_path, file.replace('.jpg', '.png'))
        image.save(png_path)

        if watermark_layout == 'center':
            # Centered layout: Overlay the watermark image centered onto each image.
            image_with_watermark = image.copy()
            watermark_width, watermark_height = watermark_image.size
            x = (image.width - watermark_width) // 2
            y = (image.height - watermark_height) // 2
            image_with_watermark.paste(watermark_image, (x, y), watermark_image)

        elif watermark_layout == 'tilt':
            # Slanted layout: Overlay the rotated watermark image onto the center of each image.
            image_with_watermark = image.copy()
            watermark_rotated = watermark_image.rotate(40, expand=True)
            watermark_width, watermark_height = watermark_rotated.size
            x = (image.width - watermark_width) // 2
            y = (image.height - watermark_height) // 2
            image_with_watermark.paste(watermark_rotated, (x, y), watermark_rotated)

        else:
            print(f'Unknown watermark layout type: {watermark_layout}')
            continue

        new_image_path = os.path.join(result_path, file.replace('.png', '.jpg'))
        image_with_watermark.convert('RGB').save(new_image_path, quality=95)
        os.remove(png_path)
        os.remove(watermark_image_path)


if len(sys.argv) < 6:
    print("Usage: python watermark_add.py <input_path> <output_path> <watermark_path> <watermark_type> <watermark_layout>")
    sys.exit(1)

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
img_path = sys.argv[1]
result_path = sys.argv[2]
watermark_path = sys.argv[3]
watermark_type = sys.argv[4]
watermark_layout = sys.argv[5]

if watermark_type == 'image':
    add_watermark_image(img_path, result_path, watermark_path, watermark_layout)
elif watermark_type == 'text':
    add_watermark_text(img_path, result_path, watermark_path, watermark_layout)
else:
    print(f"Unsupported watermark type: {watermark_type}")
