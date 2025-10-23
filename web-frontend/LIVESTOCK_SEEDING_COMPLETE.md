# Livestock Marketplace Data Seeding

## Summary

Successfully seeded the marketplace database with 7 livestock listings for testing and demonstration purposes.

## Data Seeded

### 1. **Gir Cow - Excellent Milk Producer**
- **Price**: ₹85,000
- **Location**: Ahmedabad, Gujarat
- **Description**: Healthy Gir cow producing 25-30 liters milk daily
- **Age**: 4 years
- **Status**: Featured ✓

### 2. **Holstein Friesian Cow - High Milk Yield**
- **Price**: ₹1,20,000
- **Location**: Pune, Maharashtra
- **Description**: Premium Holstein Friesian cow producing 35-40 liters per day
- **Age**: 3 years
- **Status**: Featured ✓

### 3. **Cross-Bred Jersey Cow - 2 Cows**
- **Price**: ₹1,50,000
- **Location**: Bangalore, Karnataka
- **Description**: Two healthy cross-bred Jersey cows producing 20-25 liters milk per day
- **Age**: 2.5 years each
- **Quantity**: 2 pieces

### 4. **Murrah Buffalo - Premium Breed**
- **Price**: ₹95,000
- **Location**: Ludhiana, Punjab
- **Description**: Premium Murrah buffalo producing 18-22 liters of high-fat milk daily
- **Age**: 5 years
- **Status**: Featured ✓

### 5. **Sahiwal Cow - Pure Breed**
- **Price**: ₹1,10,000
- **Location**: Karnal, Haryana
- **Description**: Pure Sahiwal cow with excellent genes producing 20-25 liters milk per day
- **Age**: 3 years

### 6. **Goat Herd - 5 Goats**
- **Price**: ₹35,000
- **Location**: Hyderabad, Telangana
- **Description**: Five healthy goats for sale
- **Age**: 6 months to 2 years
- **Quantity**: 5 pieces

### 7. **Desi Chicken - 50 Hens**
- **Price**: ₹25,000
- **Location**: Coimbatore, Tamil Nadu
- **Description**: Fifty healthy desi chickens for sale
- **Age**: 4-6 months
- **Quantity**: 50 pieces

## API Endpoint

**GET** `/api/marketplace/livestock`

Returns all approved livestock listings with pagination.

## Test the Endpoint

```bash
curl http://localhost:3000/api/marketplace/livestock
```

## View in Browser

Visit: **http://localhost:3000/marketplace/livestock**

## Features Included

✅ Complete listing data with images
✅ Seller information (name, phone)
✅ Detailed specifications for each animal
✅ Location-based listings
✅ Price range: ₹25,000 - ₹1,50,000
✅ Mix of featured and regular listings
✅ Various animal types: cows, buffalo, goats, chickens

## Database Status

All listings are marked with `status: "approved"` so they appear immediately on the marketplace page.

## Sample Data Verification

The API successfully returns all 7 listings with complete data including:
- Images
- Descriptions
- Specifications (breed, age, weight, milk production, etc.)
- Seller contact information
- Tags for searchability
- Location details

## Next Steps

1. Visit http://localhost:3000/marketplace/livestock in your browser
2. Test search functionality
3. Test filters (condition, price range, location)
4. Test pagination
5. Click on individual listings to view details

## Seed Script

The seed script is located at: `web-frontend/scripts/seed-marketplace-livestock.js`

To re-run the seed script:
```bash
node web-frontend/scripts/seed-marketplace-livestock.js
```
