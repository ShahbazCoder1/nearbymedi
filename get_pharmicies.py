import csv
import requests
import time

def get_pharmacies(city_name, lat, lon):
    url = "http://overpass-api.de/api/interpreter"
    query = f"""
    [out:json];
    (
      node["amenity"="pharmacy"](around:25000,{lat},{lon});
      way["amenity"="pharmacy"](around:25000,{lat},{lon});
      relation["amenity"="pharmacy"](around:25000,{lat},{lon});
    );
    out body;
    """
    response = requests.post(url, data={"data": query})
    
    if response.status_code == 200:
        data = response.json()
        pharmacies = []
        for element in data["elements"]:
            name = element.get("tags", {}).get("name", "Unknown")
            lat = element["lat"] if "lat" in element else None
            lon = element["lon"] if "lon" in element else None
            pharmacies.append([name, lat, lon])
        return pharmacies
    else:
        return []

with open('west_bengal_city_coords.csv', 'r') as file:
    reader = csv.DictReader(file)
    cities = [row for row in reader]

if 'latitude' not in reader.fieldnames or 'longitude' not in reader.fieldnames:
    exit(1)

output_data = []

for city in cities:
    city_name = city['city']
    lat = float(city['latitude'])
    lon = float(city['longitude'])
    
    pharmacies = get_pharmacies(city_name, lat, lon)
    
    if pharmacies:
        output_data.extend(pharmacies)
    time.sleep(1)

with open('pharmacies_in_west_bengal.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Pharmacy Name", "Latitude", "Longitude"])
    writer.writerows(output_data)

