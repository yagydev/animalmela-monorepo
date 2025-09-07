# Animall Backend API Documentation

## Overview

This document provides comprehensive documentation for the Animall backend API, covering all CRUD operations for Services and Pets, along with authentication, validation, and error handling.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Services API

### 1. Get All Services

**GET** `/services`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `serviceType` (optional): Filter by service type
- `verified` (optional): Filter by verification status (true/false)
- `active` (optional): Filter by active status (true/false)
- `priceMin` (optional): Minimum price filter
- `priceMax` (optional): Maximum price filter
- `providerId` (optional): Filter by provider ID
- `search` (optional): Text search in title and description
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order (asc/desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "service_id",
      "provider_id": {
        "_id": "user_id",
        "name": "Provider Name",
        "email": "provider@example.com",
        "phone": "+1234567890",
        "avatar_url": "avatar_url",
        "verified": true,
        "user_type": "service_provider"
      },
      "title": "Professional Pet Sitting",
      "description": "Service description...",
      "service_type": "pet_sitting",
      "price": 45,
      "currency": "USD",
      "location": {
        "lat": 40.7128,
        "lng": -74.0060,
        "address": "123 Main St, New York, NY"
      },
      "availability": {
        "monday": ["9:00 AM - 5:00 PM"],
        "tuesday": ["9:00 AM - 5:00 PM"]
      },
      "service_areas": ["Downtown", "Midtown"],
      "requirements": {
        "meetAndGreet": true,
        "vaccinationRequired": true
      },
      "features": ["24/7 supervision", "Daily updates"],
      "policies": {
        "cancellation": "24 hours notice required",
        "refund": "Full refund if cancelled 24+ hours in advance"
      },
      "included": ["Feeding", "Walking"],
      "not_included": ["Vet visits", "Grooming"],
      "photos": ["photo_url_1", "photo_url_2"],
      "verified": false,
      "active": true,
      "createdAt": "2023-12-01T00:00:00.000Z",
      "updatedAt": "2023-12-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 2. Get Service by ID

**GET** `/services/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "service_id",
    "provider_id": { /* provider object */ },
    "title": "Professional Pet Sitting",
    "description": "Service description...",
    // ... other service fields
  }
}
```

### 3. Create Service

**POST** `/services`

**Authentication:** Required (Service Provider or Admin)

**Request Body:**
```json
{
  "title": "Professional Pet Sitting",
  "description": "Service description...",
  "serviceType": "pet_sitting",
  "price": 45,
  "currency": "USD",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "address": "123 Main St, New York, NY"
  },
  "availability": {
    "monday": ["9:00 AM - 5:00 PM"],
    "tuesday": ["9:00 AM - 5:00 PM"]
  },
  "serviceAreas": ["Downtown", "Midtown"],
  "requirements": {
    "meetAndGreet": true,
    "vaccinationRequired": true
  },
  "features": ["24/7 supervision", "Daily updates"],
  "policies": {
    "cancellation": "24 hours notice required",
    "refund": "Full refund if cancelled 24+ hours in advance"
  },
  "included": ["Feeding", "Walking"],
  "notIncluded": ["Vet visits", "Grooming"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new_service_id",
    "provider_id": "user_id",
    "title": "Professional Pet Sitting",
    // ... other service fields
  }
}
```

### 4. Update Service

**PUT** `/services/:id`

**Authentication:** Required (Owner or Admin)

**Request Body:** Same as create, all fields optional

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "service_id",
    "title": "Updated Service Title",
    // ... updated service fields
  }
}
```

### 5. Delete Service

**DELETE** `/services/:id`

**Authentication:** Required (Owner or Admin)

**Response:**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

### 6. Upload Service Photos

**POST** `/services/:id/photos`

**Authentication:** Required (Owner or Admin)

**Request:** Multipart form data with photo files

**Response:**
```json
{
  "success": true,
  "data": {
    "photos": ["photo_url_1", "photo_url_2"]
  },
  "service": {
    // updated service object
  }
}
```

### 7. Get Service Types

**GET** `/services/types`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "value": "pet_sitting",
      "label": "Pet Sitting",
      "icon": "🏠",
      "description": "In-home pet sitting services"
    },
    {
      "value": "dog_walking",
      "label": "Dog Walking",
      "icon": "🐕",
      "description": "Regular walks and exercise"
    }
    // ... other service types
  ]
}
```

### 8. Get Services by Provider

**GET** `/services/provider/:providerId`

**Query Parameters:** `page`, `limit`

**Response:** Same as get all services

### 9. Toggle Service Active Status

**PATCH** `/services/:id/toggle-active`

**Authentication:** Required (Owner or Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    // updated service object
  },
  "message": "Service activated successfully"
}
```

## Pets API

### 1. Get All Pets

**GET** `/pets`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `species` (optional): Filter by species
- `breed` (optional): Filter by breed
- `ageMin` (optional): Minimum age filter
- `ageMax` (optional): Maximum age filter
- `gender` (optional): Filter by gender
- `availableForAdoption` (optional): Filter by adoption status
- `ownerId` (optional): Filter by owner ID
- `search` (optional): Text search in name, breed, description
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order (asc/desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "pet_id",
      "owner_id": {
        "_id": "user_id",
        "name": "Owner Name",
        "email": "owner@example.com",
        "phone": "+1234567890",
        "avatar_url": "avatar_url",
        "verified": true,
        "user_type": "pet_owner"
      },
      "name": "Buddy",
      "species": "dog",
      "breed": "Golden Retriever",
      "age": 3,
      "weight": 65,
      "gender": "male",
      "color": "Golden",
      "neutered": true,
      "description": "Friendly and energetic dog...",
      "medical_notes": "Allergic to chicken...",
      "special_needs": ["Daily medication", "Hip support"],
      "vaccinations": [
        {
          "_id": "vaccination_id",
          "name": "Rabies",
          "date": "2023-01-15T00:00:00.000Z",
          "next_due": "2024-01-15T00:00:00.000Z"
        }
      ],
      "health_info": {
        "allergies": ["chicken"],
        "medications": ["Carprofen 75mg daily"]
      },
      "behavior_traits": {
        "energyLevel": "high",
        "socialLevel": "very social",
        "goodWithKids": true
      },
      "photos": ["photo_url_1", "photo_url_2"],
      "gallery": ["gallery_url_1", "gallery_url_2"],
      "emergency_contact": {
        "name": "Sarah Smith",
        "phone": "+1-555-0124",
        "relationship": "Spouse"
      },
      "vet_info": {
        "name": "Dr. Emily Johnson",
        "clinic": "Downtown Veterinary Clinic",
        "phone": "+1-555-0900",
        "address": "123 Main St, Downtown"
      },
      "available_for_adoption": false,
      "adoption_fee": null,
      "createdAt": "2023-12-01T00:00:00.000Z",
      "updatedAt": "2023-12-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

### 2. Get Pet by ID

**GET** `/pets/:id`

**Response:** Same as single pet object from get all pets

### 3. Create Pet

**POST** `/pets`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Buddy",
  "species": "dog",
  "breed": "Golden Retriever",
  "age": 3,
  "weight": 65,
  "gender": "male",
  "color": "Golden",
  "neutered": true,
  "description": "Friendly and energetic dog...",
  "medicalNotes": "Allergic to chicken...",
  "specialNeeds": ["Daily medication", "Hip support"],
  "vaccinations": [
    {
      "name": "Rabies",
      "date": "2023-01-15",
      "nextDue": "2024-01-15"
    }
  ],
  "healthInfo": {
    "allergies": ["chicken"],
    "medications": ["Carprofen 75mg daily"]
  },
  "behaviorTraits": {
    "energyLevel": "high",
    "socialLevel": "very social",
    "goodWithKids": true
  },
  "photos": ["photo_url_1"],
  "gallery": ["gallery_url_1"],
  "emergencyContact": {
    "name": "Sarah Smith",
    "phone": "+1-555-0124",
    "relationship": "Spouse"
  },
  "vetInfo": {
    "name": "Dr. Emily Johnson",
    "clinic": "Downtown Veterinary Clinic",
    "phone": "+1-555-0900",
    "address": "123 Main St, Downtown"
  },
  "availableForAdoption": false,
  "adoptionFee": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new_pet_id",
    "owner_id": "user_id",
    "name": "Buddy",
    // ... other pet fields
  }
}
```

### 4. Update Pet

**PUT** `/pets/:id`

**Authentication:** Required (Owner or Admin)

**Request Body:** Same as create, all fields optional

**Response:** Updated pet object

### 5. Delete Pet

**DELETE** `/pets/:id`

**Authentication:** Required (Owner or Admin)

**Response:**
```json
{
  "success": true,
  "message": "Pet deleted successfully"
}
```

### 6. Upload Pet Photos

**POST** `/pets/:id/photos`

**Authentication:** Required (Owner or Admin)

**Request:** Multipart form data with photo files

**Response:**
```json
{
  "success": true,
  "data": {
    "photos": ["photo_url_1", "photo_url_2"]
  },
  "pet": {
    // updated pet object
  }
}
```

### 7. Add Vaccination

**POST** `/pets/:id/vaccinations`

**Authentication:** Required (Owner or Admin)

**Request Body:**
```json
{
  "name": "Lyme Disease",
  "date": "2023-12-01",
  "nextDue": "2024-12-01"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // updated pet object with new vaccination
  },
  "message": "Vaccination added successfully"
}
```

### 8. Update Vaccination

**PUT** `/pets/:id/vaccinations/:vaccinationId`

**Authentication:** Required (Owner or Admin)

**Request Body:** Same as add vaccination, all fields optional

**Response:** Updated pet object

### 9. Delete Vaccination

**DELETE** `/pets/:id/vaccinations/:vaccinationId`

**Authentication:** Required (Owner or Admin)

**Response:**
```json
{
  "success": true,
  "message": "Vaccination deleted successfully"
}
```

### 10. Get Pet Species

**GET** `/pets/species`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "value": "dog",
      "label": "Dog",
      "icon": "🐕",
      "description": "Dogs and puppies"
    },
    {
      "value": "cat",
      "label": "Cat",
      "icon": "🐱",
      "description": "Cats and kittens"
    }
    // ... other species
  ]
}
```

### 11. Get Pets by Owner

**GET** `/pets/owner/:ownerId`

**Query Parameters:** `page`, `limit`

**Response:** Same as get all pets

### 12. Toggle Pet Adoption Status

**PATCH** `/pets/:id/toggle-adoption`

**Authentication:** Required (Owner or Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    // updated pet object
  },
  "message": "Pet made available for adoption"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Validation Rules

### Services
- `title`: Required, 3-255 characters
- `description`: Optional, max 2000 characters
- `serviceType`: Required, must be valid enum value
- `price`: Optional, non-negative number
- `currency`: Optional, 3 characters
- `location.lat`: Optional, valid latitude
- `location.lng`: Optional, valid longitude
- `location.address`: Optional, max 500 characters

### Pets
- `name`: Required, 1-255 characters
- `species`: Required, must be valid enum value
- `breed`: Optional, max 100 characters
- `age`: Optional, 0-30 years
- `weight`: Optional, 0-1000 lbs
- `gender`: Optional, must be valid enum value
- `color`: Optional, max 100 characters
- `description`: Optional, max 2000 characters
- `medicalNotes`: Optional, max 2000 characters

## Testing

Use the provided test script to verify all endpoints:

```bash
node test-api.js
```

This will test all CRUD operations, validation, error handling, and authentication.
