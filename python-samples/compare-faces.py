import boto3
import json

s3 = boto3.resource('s3')
for bucket in s3.buckets.all():
    print(bucket.name)

# Image
image1Name = "hello.png"
image2Name = "hello.png"

# Read image content
with open(image1Name, "rb") as document:
    image1Bytes = bytearray(document.read())

with open(image2Name, "rb") as document:
    image2Bytes = bytearray(document.read())

# Amazon Rekognition client
rekognition = boto3.client("rekognition")

# Call Amazon Rekognition
response = rekognition.compare_faces(
    SourceImage={
        "Bytes": image1Bytes,
    },
    TargetImage={
        "Bytes": image2Bytes,
    },
    SimilarityThreshold=90,
    QualityFilter="HIGH",
)

with open("compare-faces.json", "w") as f:
    f.write(json.dumps(response))