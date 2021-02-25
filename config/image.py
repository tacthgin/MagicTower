from PIL import Image
import os

size = 32

def intercept(file):
    array = file[:-4].split("_")
    if file.find(".png") != -1:
        with Image.open(file) as im:
            w, h = im.size
            for j in range(0, int(h / size)):
                for i in range(0, int(w / size)):
                    imc = im.crop((i * size, j * size, (i + 1) * size, (j + 1) * size))
                    imc.save('new/{}_{}.png'.format(array[j], i), 'png')
    
if __name__ == '__main__':
    newDirPath = os.getcwd() + os.path.sep + "new"
    if not os.path.exists(newDirPath):
        os.mkdir(newDirPath)
    for file in os.listdir(os.getcwd()):
        intercept(file)