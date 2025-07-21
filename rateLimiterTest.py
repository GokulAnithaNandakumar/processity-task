import requests
import time

API_URL = "https://taskmanager-api-prod-ocwrlppzw2f4s.azurewebsites.net/api/tasks"  # Replace with your actual endpoint
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4N2NlNGZkYWIzZDQzY2JiMWQ4NDE2MSIsImlhdCI6MTc1MzA4ODk5MywiZXhwIjoxNzUzNjkzNzkzfQ.tfCjH5s76C9RyNirR9yJJHRa22YCawUubeQBphzC-Fo"  # Replace with your valid JWT if auth is required

headers = {
    "Authorization": f"Bearer {TOKEN}"
}

total_requests = 150  # Number of rapid requests to make

for i in range(total_requests):
    response = requests.get(API_URL, headers=headers)
    print(f"Request {i+1}: Status Code = {response.status_code}")

    if response.status_code == 429:
        print("Rate limiter triggered!")
        print("Response:", response.text)
        break

    time.sleep(0.1)  # Slight delay between requests (tweak as needed)
