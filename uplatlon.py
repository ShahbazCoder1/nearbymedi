import pandas as pd
import requests
import urllib.parse
import uuid
import time
import os

input_file_path = "found_medical_places.csv"
output_file_path = "final.csv"

api_url = "https://api.olamaps.io/places/v1/geocode"
api_key = os.getenv("OLA_API_KEY")

df = pd.read_csv(input_file_path)
df = df.drop_duplicates(subset=['id', 'address'], keep='first')

data_dict = df.set_index('id').to_dict('index')

def process_data(data):
    for row_id, row in data.items():
        address = row.get('address')
        if pd.isna(address):
            continue

        encoded_address = urllib.parse.quote(address)
        url = f"{api_url}?address={encoded_address}&language=hi&api_key={api_key}"
        headers = {"X-Request-Id": str(uuid.uuid4())}

        try:
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                response_data = response.json()
                if response_data.get('geocodingResults'):
                    first_result = response_data['geocodingResults'][0]
                    geometry = first_result.get('geometry', {})
                    location = geometry.get('location', {})
                    latitude = location.get('lat', None)
                    longitude = location.get('lng', None)
                    name = first_result.get('name', "N/A")
                    formatted_address = first_result.get('formatted_address', "N/A")

                    row.update({
                        'name': name,
                        'address': formatted_address,
                        'latitude': latitude,
                        'longitude': longitude
                    })
            elif response.status_code == 429:
                retry_after = int(response.headers.get("Retry-After", 60))
                time.sleep(retry_after)
                continue
        except:
            continue

process_data(data_dict)

processed_df = pd.DataFrame.from_dict(data_dict, orient='index')
processed_df.to_csv(output_file_path, index_label='id')

