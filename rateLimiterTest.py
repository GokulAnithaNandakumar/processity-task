import requests
import time

API_URL = "https://taskmanager-api-prod-ocwrlppzw2f4s.azurewebsites.net/api/tasks"  # Replace with your actual endpoint
TOKEN = "xxxx"

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
