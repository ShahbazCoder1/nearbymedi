from HaverDistance import haversine
from supabase import create_client
import os
import math
import random

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
if not url or not key:
    raise EnvironmentError("SUPABASE_URL and SUPABASE_KEY must be set.")
supabase = create_client(url, key)

def format_distance(dist_km):
    return f"{int(dist_km * 1000)}m" if dist_km < 1 else f"{round(dist_km, 2)}km"

def calculate_bounding_box(lat, lon, radius_km):
    lat_delta = radius_km / 111
    lon_delta = radius_km / (111 * abs(math.cos(math.radians(lat))))
    return (lat - lat_delta, lat + lat_delta, lon - lon_delta, lon + lon_delta)

def fetch_locations_in_bounding_box(lat, lon, radius_km):
    bbox = calculate_bounding_box(lat, lon, radius_km)
    try:
        response = supabase.table("location").select("*") \
            .gte("latitude", bbox[0]) \
            .lte("latitude", bbox[1]) \
            .gte("longitude", bbox[2]) \
            .lte("longitude", bbox[3]) \
            .execute()
        return response.data if response.data else []
    except Exception as e:
        print(f"Error fetching locations: {e}")
        return []

def fetch_ratings_reviews():
    try:
        response = supabase.table("rating and reviews").select("*").execute()
        ratings_reviews = response.data if response.data else []
        grouped = {}
        for item in ratings_reviews:
            location_id = item.get("location_id")
            if location_id not in grouped:
                grouped[location_id] = []
            grouped[location_id].append(item)
        return grouped
    except Exception as e:
        print(f"Error fetching ratings and reviews: {e}")
        return {}

def get_nearby_locations_with_ratings(lat, lon, radius_km=5):
    locations = fetch_locations_in_bounding_box(lat, lon, radius_km)
    ratings_reviews = fetch_ratings_reviews()
    nearby = []
    for location in locations:
        try:
            lat2 = float(location.get("latitude"))
            lon2 = float(location.get("longitude"))
            dist = haversine(lat, lon, lat2, lon2)
            if dist <= radius_km:
                location_id = location.get("id")
                reviews_for_location = ratings_reviews.get(location_id, [{"rating": 0, "reviews": "No reviews"}])
                random_review = random.choice(reviews_for_location)
                nearby.append({
                    "id": location_id,
                    "name": location.get("name", "Unnamed"),
                    "isOpen": True,
                    "distance": format_distance(dist),
                    "address": location.get("address", "Not Available"),
                    "rating": random_review["rating"],
                    "reviews": random_review["reviews"],
                    "selected": False
                })
        except Exception as e:
            print(f"Error processing location {location.get('id')}: {e}")
            continue
    return nearby

print(get_nearby_locations_with_ratings(26.7553826927443, 89.07331837646706, radius_km=10))

