import requests
import csv
import uuid
import time
import os

OLA_API_KEY = os.getenv('OLA_API_KEY')

def get_nearby_pharmacies(lat, lon, radius_km=150):
    url = "https://api.olamaps.io/places/v1/nearbysearch"
    params = {
        "layers": "venue",
        "types": "pharmacy",
        "location": f"{lat},{lon}",
        "radius": radius_km * 1000,
        "limit": 50,
        "api_key": OLA_API_KEY
    }
    headers = {
        "X-Request-Id": str(uuid.uuid4())
    }

    try:
        response = requests.get(url, params=params, headers=headers)
        if response.status_code == 200:
            data = response.json()
            return data.get("predictions", [])
    except:
        pass
    return []

def extract_pharmacy_data(pharmacy):
    place_id = pharmacy.get("place_id", "")
    name = pharmacy.get("description", "").split(",")[0].strip() if pharmacy.get("description") else pharmacy.get("main_text", "")
    full_description = pharmacy.get("description", "")
    address_parts = full_description.split(",")[1:] if full_description and "," in full_description else []
    address = ", ".join(address_parts).strip() if address_parts else ""
    distance_meters = pharmacy.get("distance_meters", "")
    if distance_meters:
        try:
            distance = f"{float(distance_meters)/1000:.2f} km"
        except:
            distance = f"{distance_meters} m"
    else:
        distance = ""
    place_lat = ""
    place_lon = ""
    return {
        "id": place_id,
        "name": name,
        "address": address,
        "latitude": place_lat,
        "longitude": place_lon,
        "distance": distance,
        "selected": False
    }

def scan_medical_places():
    csv_file_path = 'found_medical_places.csv'
    file_exists = os.path.isfile(csv_file_path)
    fieldnames = ["id", "name", "address", "latitude", "longitude", "distance", "selected"]
    
    if not file_exists:
        with open(csv_file_path, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()

    found_ids = set()
    
    if file_exists:
        with open(csv_file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                found_ids.add(row["id"])

    with open('west_bengal_places.csv', mode='r') as file:
        csv_reader = csv.DictReader(file)
        rows = list(csv_reader)

    total_cities = len(rows)
    scanned_cities = 0
    total_places_found = len(found_ids)

    for row in rows:
        city_name = row["city"]
        try:
            lat = float(row["latitude"])
            lon = float(row["longitude"])
        except:
            continue

        pharmacies = get_nearby_pharmacies(lat, lon)
        new_found = 0

        if pharmacies:
            with open(csv_file_path, mode='a', newline='', encoding='utf-8') as file:
                writer = csv.DictWriter(file, fieldnames=fieldnames)
                for pharmacy in pharmacies:
                    place_data = extract_pharmacy_data(pharmacy)
                    if place_data["id"] in found_ids:
                        continue
                    writer.writerow(place_data)
                    found_ids.add(place_data["id"])
                    new_found += 1
                    total_places_found += 1

        scanned_cities += 1
        time.sleep(1)

    print(f"{total_places_found} places found in total.")

if __name__ == "__main__":
    scan_medical_places()

