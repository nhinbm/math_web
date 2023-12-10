import cv2
import pytesseract
import pybase64
import io
from PIL import Image
import numpy as np
import imutils

def convert_string_to_img(text):
    # Decode base64 string data
    decoded_data = pybase64.b64decode(text)
    img = Image.open(io.BytesIO(decoded_data))

    # Convert image to array
    img_array = np.array(img)

    return img_array

def OCT_core(img):
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    text = pytesseract.image_to_string(img, lang='vie', config='--oem 3 --psm 6 -l vie+equ')

    return text

def get_grayscale(image):
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

def thresholding(image):
    return cv2.threshold(image, 0, 255,cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]

def distance_transform(image):
    dist = cv2.distanceTransform(image, cv2.DIST_L2, 5)
    dist = cv2.normalize(dist, dist, 0, 1.0, cv2.NORM_MINMAX)
    dist = (dist * 255).astype("uint8")
    dist = cv2.threshold(dist, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    return dist

def find_countour(image):
    # find contours in the opening image, then initialize the list of
    # contours which belong to actual characters that we will be OCR'ing
    cnts = cv2.findContours(image.copy(), cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    chars = []
    # loop over the contours
    for c in cnts:
        # compute the bounding box of the contour
        (x, y, w, h) = cv2.boundingRect(c)
        # check if contour is at least 35px wide and 100px tall, and if
        # so, consider the contour a digit
        if w >= 35 and h >= 100:
            chars.append(c)

    # Check if there are any contours to concatenate
    if len(chars) == 0:
        return image  # or return None, depending on your needs

    # compute the convex hull of the characters
    chars = np.vstack([chars[i] for i in range(0, len(chars))])
    hull = cv2.convexHull(chars)
    # allocate memory for the convex hull mask, draw the convex hull on
    # the image, and then enlarge it via a dilation
    mask = np.zeros(image.shape[:2], dtype="uint8")
    cv2.drawContours(mask, [hull], -1, 255, -1)
    mask = cv2.dilate(mask, None, iterations=2)
    # take the bitwise of the opening image and the mask to reveal *just*
    # the characters in the image
    final = cv2.bitwise_and(image, image, mask=mask)
    return final

def process_ocr(text):
    img = convert_string_to_img(text)
    img = get_grayscale(img)
    img = thresholding(img) 
    img = distance_transform(img) # nổi bật trắng đen
    img = find_countour(img) # Loại bỏ nhiễu
    content = OCT_core(img)

    return content


