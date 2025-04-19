# NearByMedi

**Tagline:** Healthcare, simplified.

## Problem Statement
Finding medicines can be challenging because medicines are often available at one shop but not at others. This creates inconvenience for people in need of specific medications.

## Solution
NearByMedi provides a system where users can search for medicines and find the nearest shop that has the medicine in stock. Additionally, it provides a map and directions to the shop for convenience.

## Workflow
https://github.com/user-attachments/assets/06791dd8-b6bc-4be0-a5fc-3774a3633a13

## Tech Stack
- **Frontend:** React
- **Backend:** Flask, Python
- **Database:** SupaBase
- **Mapping APIs:** Ola Maps, OpenStreetMap API!

- **Dataset Source:** Kaggle

## Features
1. **Medicine Search:** Users can search for a medicine to check its availability.
2. **Nearest Shop Locator:** The system identifies and displays the nearest shop where the medicine is available.
3. **Shop Description:** Provides a short description of the shop.
4. **Map Integration:** Displays a map with directions to the shop.

## Implementation Details
1. **Backend Data:**
   - We used Kaggle's free dataset: [AZ Medicine Dataset of India](https://www.kaggle.com/datasets/shudhanshusingh/az-medicine-dataset-of-india) to gather information on all available medications in India.
   - For shop coordinates, major cities in West Bengal were sourced from Wikipedia. OpenStreetMap API was used to collect data on surrounding cities and villages, with Ola Maps API providing detailed shop information.
2. **Distance Calculation:**
   - The Haversine formula was employed to calculate the distances between the user's location and the shops.
3. **Frontend Integration:**
   - A user-friendly interface was developed to ensure a seamless experience for users searching for medicines.

## Challenges Faced
1. **Data Collection:** Merging data from different sources was time-consuming and required significant effort.
2. **Distance Calculations:** Applying the Haversine formula for distance calculation was complex.
3. **UI/UX Design:** Multiple design attempts were made to achieve an optimal user interface.
4. **Branch Merging:** Difficulties were encountered while merging teammates' branches into the main branch.

## What We Learned
- The importance of efficient data collection and integration.
- Implementing advanced distance calculation methods such as the Haversine formula.
- Overcoming UI/UX challenges and refining design approaches.
- Effective collaboration and branch management in team projects.

*Note: Diagrams and design attempts to be attached.*
