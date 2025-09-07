// Shared validation schemas using Joi

import Joi from 'joi';

// User validation schemas
export const userRegistrationSchema = Joi.object({
  firstName: Joi.string()
    .min(1)
    .max(50)
    .trim()
    .required()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 1 character',
      'string.max': 'First name must not exceed 50 characters'
    }),
  
  lastName: Joi.string()
    .min(1)
    .max(50)
    .trim()
    .required()
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 1 character',
      'string.max': 'Last name must not exceed 50 characters'
    }),
  
  email: Joi.string()
    .email()
    .normalizeEmail()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
  
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      'string.empty': 'Password is required'
    }),
  
  role: Joi.string()
    .valid('pet_owner', 'service_provider')
    .required()
    .messages({
      'any.only': 'Role must be either pet_owner or service_provider',
      'string.empty': 'Role is required'
    }),
  
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-\(\)]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    })
});

export const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .normalizeEmail()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required'
    })
});

export const userUpdateSchema = Joi.object({
  firstName: Joi.string()
    .min(1)
    .max(50)
    .trim()
    .optional(),
  
  lastName: Joi.string()
    .min(1)
    .max(50)
    .trim()
    .optional(),
  
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-\(\)]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  
  avatar_url: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Please provide a valid URL for avatar'
    })
});

// Service validation schemas
export const serviceCreateSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(255)
    .trim()
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must not exceed 255 characters',
      'string.empty': 'Title is required'
    }),
  
  description: Joi.string()
    .max(2000)
    .trim()
    .optional()
    .messages({
      'string.max': 'Description must not exceed 2000 characters'
    }),
  
  serviceType: Joi.string()
    .valid(
      'pet_sitting',
      'dog_walking',
      'grooming',
      'training',
      'veterinary',
      'boarding',
      'pet_taxi',
      'pet_photography',
      'pet_massage',
      'pet_yoga',
      'other'
    )
    .required()
    .messages({
      'any.only': 'Invalid service type',
      'string.empty': 'Service type is required'
    }),
  
  price: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Price must be non-negative'
    }),
  
  currency: Joi.string()
    .length(3)
    .uppercase()
    .default('USD')
    .optional()
    .messages({
      'string.length': 'Currency must be 3 characters'
    }),
  
  location: Joi.object({
    lat: Joi.number()
      .min(-90)
      .max(90)
      .optional()
      .messages({
        'number.min': 'Latitude must be between -90 and 90',
        'number.max': 'Latitude must be between -90 and 90'
      }),
    
    lng: Joi.number()
      .min(-180)
      .max(180)
      .optional()
      .messages({
        'number.min': 'Longitude must be between -180 and 180',
        'number.max': 'Longitude must be between -180 and 180'
      }),
    
    address: Joi.string()
      .max(500)
      .trim()
      .optional()
      .messages({
        'string.max': 'Address must not exceed 500 characters'
      })
  }).optional(),
  
  availability: Joi.object().optional(),
  serviceAreas: Joi.array().items(Joi.string()).optional(),
  requirements: Joi.object().optional(),
  features: Joi.array().items(Joi.string()).optional(),
  policies: Joi.object().optional(),
  included: Joi.array().items(Joi.string()).optional(),
  notIncluded: Joi.array().items(Joi.string()).optional()
});

export const serviceUpdateSchema = serviceCreateSchema.fork(
  ['title', 'serviceType'],
  (schema) => schema.optional()
);

// Pet validation schemas
export const petCreateSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(255)
    .trim()
    .required()
    .messages({
      'string.min': 'Pet name must be at least 1 character',
      'string.max': 'Pet name must not exceed 255 characters',
      'string.empty': 'Pet name is required'
    }),
  
  species: Joi.string()
    .valid('dog', 'cat', 'bird', 'fish', 'reptile', 'rabbit', 'hamster', 'other')
    .required()
    .messages({
      'any.only': 'Invalid species',
      'string.empty': 'Species is required'
    }),
  
  breed: Joi.string()
    .max(100)
    .trim()
    .optional()
    .messages({
      'string.max': 'Breed must not exceed 100 characters'
    }),
  
  age: Joi.number()
    .min(0)
    .max(30)
    .optional()
    .messages({
      'number.min': 'Age must be non-negative',
      'number.max': 'Age must not exceed 30 years'
    }),
  
  weight: Joi.number()
    .min(0)
    .max(1000)
    .optional()
    .messages({
      'number.min': 'Weight must be non-negative',
      'number.max': 'Weight must not exceed 1000 lbs'
    }),
  
  gender: Joi.string()
    .valid('male', 'female', 'unknown')
    .optional()
    .messages({
      'any.only': 'Gender must be male, female, or unknown'
    }),
  
  color: Joi.string()
    .max(100)
    .trim()
    .optional()
    .messages({
      'string.max': 'Color must not exceed 100 characters'
    }),
  
  neutered: Joi.boolean()
    .default(false)
    .optional(),
  
  description: Joi.string()
    .max(2000)
    .trim()
    .optional()
    .messages({
      'string.max': 'Description must not exceed 2000 characters'
    }),
  
  medicalNotes: Joi.string()
    .max(2000)
    .trim()
    .optional()
    .messages({
      'string.max': 'Medical notes must not exceed 2000 characters'
    }),
  
  specialNeeds: Joi.array()
    .items(Joi.string())
    .optional(),
  
  vaccinations: Joi.array()
    .items(Joi.object({
      name: Joi.string().required(),
      date: Joi.date().required(),
      nextDue: Joi.date().required()
    }))
    .optional(),
  
  healthInfo: Joi.object().optional(),
  behaviorTraits: Joi.object().optional(),
  photos: Joi.array().items(Joi.string()).optional(),
  gallery: Joi.array().items(Joi.string()).optional(),
  
  emergencyContact: Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    relationship: Joi.string().optional()
  }).optional(),
  
  vetInfo: Joi.object({
    name: Joi.string().optional(),
    clinic: Joi.string().optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional()
  }).optional(),
  
  availableForAdoption: Joi.boolean()
    .default(false)
    .optional(),
  
  adoptionFee: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Adoption fee must be non-negative'
    })
});

export const petUpdateSchema = petCreateSchema.fork(
  ['name', 'species'],
  (schema) => schema.optional()
);

// Booking validation schemas
export const bookingCreateSchema = Joi.object({
  serviceId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Service ID is required'
    }),
  
  petId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Pet ID is required'
    }),
  
  startDate: Joi.date()
    .min('now')
    .required()
    .messages({
      'date.min': 'Start date must be in the future',
      'date.base': 'Please provide a valid start date'
    }),
  
  endDate: Joi.date()
    .min(Joi.ref('startDate'))
    .required()
    .messages({
      'date.min': 'End date must be after start date',
      'date.base': 'Please provide a valid end date'
    }),
  
  specialInstructions: Joi.string()
    .max(1000)
    .trim()
    .optional()
    .messages({
      'string.max': 'Special instructions must not exceed 1000 characters'
    }),
  
  notes: Joi.string()
    .max(1000)
    .trim()
    .optional()
    .messages({
      'string.max': 'Notes must not exceed 1000 characters'
    })
});

// Review validation schemas
export const reviewCreateSchema = Joi.object({
  serviceId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Service ID is required'
    }),
  
  bookingId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Booking ID is required'
    }),
  
  rating: Joi.number()
    .min(1)
    .max(5)
    .integer()
    .required()
    .messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must not exceed 5',
      'number.integer': 'Rating must be a whole number'
    }),
  
  comment: Joi.string()
    .max(1000)
    .trim()
    .optional()
    .messages({
      'string.max': 'Comment must not exceed 1000 characters'
    }),
  
  photos: Joi.array()
    .items(Joi.string())
    .optional()
});

// Query parameter validation schemas
export const paginationSchema = Joi.object({
  page: Joi.number()
    .min(1)
    .default(1)
    .optional(),
  
  limit: Joi.number()
    .min(1)
    .max(100)
    .default(10)
    .optional()
});

export const serviceFilterSchema = paginationSchema.keys({
  serviceType: Joi.string()
    .valid(
      'pet_sitting',
      'dog_walking',
      'grooming',
      'training',
      'veterinary',
      'boarding',
      'pet_taxi',
      'pet_photography',
      'pet_massage',
      'pet_yoga',
      'other'
    )
    .optional(),
  
  verified: Joi.boolean().optional(),
  active: Joi.boolean().optional(),
  priceMin: Joi.number().min(0).optional(),
  priceMax: Joi.number().min(0).optional(),
  providerId: Joi.string().optional(),
  search: Joi.string().trim().optional(),
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'title', 'price').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional()
});

export const petFilterSchema = paginationSchema.keys({
  species: Joi.string()
    .valid('dog', 'cat', 'bird', 'fish', 'reptile', 'rabbit', 'hamster', 'other')
    .optional(),
  
  breed: Joi.string().trim().optional(),
  ageMin: Joi.number().min(0).optional(),
  ageMax: Joi.number().min(0).optional(),
  gender: Joi.string().valid('male', 'female', 'unknown').optional(),
  availableForAdoption: Joi.boolean().optional(),
  ownerId: Joi.string().optional(),
  search: Joi.string().trim().optional(),
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'name', 'age').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional()
});

// Validation helper function
export const validateSchema = (schema: Joi.ObjectSchema, data: any) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return {
      isValid: false,
      errors: details,
      data: null
    };
  }
  
  return {
    isValid: true,
    errors: [],
    data: value
  };
};
