from PIL import Image
import sys

def remove_green(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        r, g, b, a = item
        if g > 200 and r < 100 and b < 100:
            new_data.append((255, 255, 255, 0))
        elif g > r + 30 and g > b + 30 and g > 120:
            alpha = max(0, 255 - (g - max(r, b)) * 2)
            new_data.append((r, g, b, alpha))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_green(sys.argv[1], sys.argv[2])
