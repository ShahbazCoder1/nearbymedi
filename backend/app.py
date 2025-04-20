from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import get_nearby_locations_with_ratings

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure Flask app for JSON
app.config['JSON_AS_ASCII'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

@app.route('/nearby-locations', methods=['GET'])
def nearby_locations():
    """
    API endpoint to get nearby locations based on latitude, longitude, and radius.
    """
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
        radius = float(request.args.get('radius', 10))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid parameters. Please provide valid 'lat', 'lon', and 'radius'."}), 400

    # Get nearby locations
    result = get_nearby_locations_with_ratings(lat, lon, radius)
    
    # Return JSON response
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
