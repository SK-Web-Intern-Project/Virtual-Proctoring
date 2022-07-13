import boto3
import json
import cv2
import mediapipe as mp

s3 = boto3.resource('s3')
for bucket in s3.buckets.all():
    print(bucket.name)

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
cap.set(3, 640)
cap.set(4, 480)

# Image
imageName = "hello.png"

# Read image content
with open(imageName, "rb") as document:
    imageBytes = bytearray(document.read())

# Amazon Rekognition client
rekognition = boto3.client("rekognition")

# Call Amazon Rekognition
response = rekognition.detect_faces(
    Image={"Bytes": imageBytes},
)

# print(response)

with open("detect-faces.json", "w") as f:
    f.write(json.dumps(response))

mpFaceDetection = mp.solutions.face_detection
mpDraw = mp.solutions.drawing_utils
faceDetection = mpFaceDetection.FaceDetection()

while True:
    # detect img from camera
    check, img = cap.read()
    results = faceDetection.process(img)
    print(results)

    if results.detections:
        for id,detection in enumerate(results.detections):
            print(id, detection)
            print(detection.score)

    cv2.imshow("Output", img)
    cv2.waitKey(100)
    #print(response)



cap.release()
cv2.destroyAllWindows()