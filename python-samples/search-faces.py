import boto3
import json

s3 = boto3.resource('s3')
for bucket in s3.buckets.all():
    print(bucket.name)

cap = cv2.VideoCapture(1, cv2.CAP_DSHOW)
cap.set(3, 640)
cap.set(4, 480)

# Image
imageName = "media/face-search.jpeg"
COLLECTION_ID = "virtual-proctor-sample-collection"
# Read image content
with open(imageName, "rb") as document:
    imageBytes = bytearray(document.read())

# Amazon Rekognition client
rekognition = boto3.client("rekognition")

# Create a collection if one does not exist
rekognition.create_collection(CollectionId=COLLECTION_ID)

# Call Amazon Rekognition
response = rekognition.search_faces_by_image(
    CollectionId=COLLECTION_ID,
    Image={
        "Bytes": imageBytes,
    },
    MaxFaces=5,
    FaceMatchThreshold=95,
    QualityFilter="HIGH",
)


with open("search-faces.json", "w") as f:
    f.write(json.dumps(response))

