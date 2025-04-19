from HaverDistance import haversine
from supabase import create_client
import os
import random

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

if not url or not key:
    exit(1)

supabase = create_client(url, key)

def format_distance(dist_km):
    return f"{int(dist_km * 1000)}m" if dist_km < 1 else f"{round(dist_km, 2)}km"

def fetch_all_locations():
    all_locations = []
    page_size = 1000
    offset = 0

    while True:
        try:
            response = supabase.table("location").select("*").range(offset, offset + page_size - 1).execute()
            batch = response.data
            if not batch:
                break
            all_locations.extend(batch)
            offset += page_size
        except Exception as e:
            print(f"Error fetching data: {e}")
            break

    return all_locations

def fetch_all_ratings_reviews():
    try:
        response = supabase.table("rating and reviews").select("*").execute()
        return response.data if response.data else []
    except Exception as e:
        print(f"Error fetching ratings and reviews: {e}")
        return []

def get_nearby_locations_with_ratings(lat, lon, radius_km=5):
    locations = fetch_all_locations()
    ratings_reviews = fetch_all_ratings_reviews()

    nearby = []
    for location in locations:
        try:
            lat2 = float(location.get("latitude"))
            lon2 = float(location.get("longitude"))
            dist = haversine(lat, lon, lat2, lon2)

            if dist <= radius_km:
                random_rating_review = random.choice(ratings_reviews) if ratings_reviews else {"rating": 0, "reviews": "No reviews"}
                nearby.append({
                    "id": location["id"],
                    "name": location.get("name", "Unnamed"),
                    "isOpen": True,
                    "distance": format_distance(dist),
                    "address": location.get("address", "Not Available"),
                    "rating": random_rating_review["rating"],
                    "reviews": random_rating_review["reviews"],
                    "selected": False
                })
        except Exception:
            continue

    return nearby

