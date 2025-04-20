# NearByMedi

**Tagline:** Healthcare, simplified.

## Problem Statement
Finding medicines can be challenging because medicines are often available at one shop but not at others. This creates inconvenience for people in need of specific medications.

## Solution
NearByMedi provides a system where:
1. **Users:** Can search for medicines and find the nearest shop that has the medicine in stock. Additionally, it provides a map and directions to the shop for convenience.
2. **Shop Owners:** Can upload Excel sheets of medicines available in their shop to add their shop to the system.

## Workflow
Below is the system architecture diagram illustrating the workflow of "NearByMedi":

![System Architecture Diagram](path/to/diagram.png)

### Diagram Description
The diagram showcases the following components and their interactions:
1. **Frontend**:
   - **For Users:** Accepts inputs like **longitude**, **latitude**, and **medicine**, and displays the nearest shops with the requested medicine.
   - **For Shop Owners:** Provides an interface to upload Excel sheets containing details of medicines available in their shop.
2. **API**:
   - Acts as the intermediary between the **Frontend** and **Backend**.
   - Processes requests from both users and shop owners.
3. **Backend**:
   - **For Users:** Handles core processing tasks like distance calculation and fetching pharmacy details.
   - **For Shop Owners:** Processes the uploaded Excel sheets, extracts shop and medicine details, and updates the database.
4. **Distance Calculator**:
   - Calculates distances using the **Haversine Formula**.
   - Provides distance data to the backend.
5. **Database**:
   - Stores and manages multiple tables:
     - **User Table**: Stores user credentials and roles.
     - **Medicines Table**: Maps pharmacies to the medicines they stock.
     - **Pharmacy Table**: Contains pharmacy details, including longitude, latitude, and address.
     - **Ratings and Reviews Table**: Tracks pharmacy ratings and reviews.

*Note: The system architecture and workflows were designed using [Excalidraw](https://excalidraw.com).*

## Tech Stack
- **Frontend:** React
- **Backend:** Flask, Python
- **Database:** SupaBase ([Dashboard](https://supabase.com/dashboard/))
- **Mapping APIs:** Ola Maps ([Documentation](https://maps.olakrutrim.com/docs)), OpenStreetMap API
- **Dataset Source:** Kaggle
- **File Handling:** Excel Sheet Processing

## Features
1. **Medicine Search:** Users can search for a medicine to check its availability.
2. **Nearest Shop Locator:** The system identifies and displays the nearest shop where the medicine is available.
3. **Shop Description:** Provides a short description of the shop.
4. **Map Integration:** Displays a map with directions to the shop.
5. **Shop Owner Integration:** Allows shop owners to upload Excel sheets containing details of available medicines to add or update their shop in the system.

## Implementation Details
1. **Backend Data:**
   - We used Kaggle's free dataset: [AZ Medicine Dataset of India](https://www.kaggle.com/datasets/shudhanshusingh/az-medicine-dataset-of-india) to gather information on all available medications in India.
   - For shop coordinates, major cities in West Bengal were sourced from Wikipedia. OpenStreetMap API was used to collect data on surrounding cities and villages, with Ola Maps API providing detailed shop information ([Ola Maps Documentation](https://maps.olakrutrim.com/docs)).
2. **Distance Calculation:**
   - The Haversine formula was employed to calculate the distances between the user's location and the shops.
3. **Excel Sheet Processing:**
   - The backend processes uploaded Excel files to extract shop and medicine details, which are then added or updated in the database.
4. **Frontend Integration:**
   - A user-friendly interface was developed to ensure a seamless experience for both users and shop owners.

## Challenges Faced
1. **Data Collection:** Merging data from different sources was time-consuming and required significant effort.
2. **Distance Calculations:** Applying the Haversine formula for distance calculation was complex.
3. **UI/UX Design:** Multiple design attempts were made to achieve an optimal user interface.
4. **Branch Merging:** Difficulties were encountered while merging teammates' branches into the main branch.
5. **Excel File Handling:** Ensuring accurate parsing and validation of data from uploaded Excel sheets.

## What We Learned
- The importance of efficient data collection and integration.
- Implementing advanced distance calculation methods such as the Haversine formula.
- Overcoming UI/UX challenges and refining design approaches.
- Effective collaboration and branch management in team projects.
- Handling and validating Excel file uploads for database updates.

*Note: Attachments such as diagrams and design attempts are to be included in the appropriate repository folder.*
