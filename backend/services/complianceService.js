// Compliance Module for AnimalMela - Indian E-commerce, GST, Livestock Welfare, Data Privacy
const crypto = require('crypto');
const moment = require('moment');

// Indian GST Compliance
const gstCompliance = {
  // GST rates for different livestock categories
  GST_RATES: {
    LIVESTOCK: 0, // Livestock is GST exempt
    LIVESTOCK_FEED: 5,
    LIVESTOCK_EQUIPMENT: 12,
    VETERINARY_SERVICES: 18,
    TRANSPORT_SERVICES: 18,
    INSURANCE_SERVICES: 18,
    COMMISSION_FEE: 18
  },

  // Calculate GST for a transaction
  calculateGST: (amount, category, isBusiness = false) => {
    const rate = gstCompliance.GST_RATES[category] || 0;
    
    if (rate === 0) {
      return {
        baseAmount: amount,
        gstAmount: 0,
        totalAmount: amount,
        gstRate: 0,
        cgst: 0,
        sgst: 0,
        igst: 0
      };
    }

    const gstAmount = (amount * rate) / 100;
    const totalAmount = amount + gstAmount;
    
    // For interstate transactions, IGST applies
    // For intrastate transactions, CGST + SGST applies
    const cgst = isBusiness ? gstAmount / 2 : 0;
    const sgst = isBusiness ? gstAmount / 2 : 0;
    const igst = !isBusiness ? gstAmount : 0;

    return {
      baseAmount: amount,
      gstAmount,
      totalAmount,
      gstRate: rate,
      cgst,
      sgst,
      igst
    };
  },

  // Generate GST invoice
  generateGSTInvoice: (orderData, sellerGSTIN, buyerGSTIN = null) => {
    const invoiceNumber = `INV-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const invoiceDate = moment().format('DD-MM-YYYY');
    
    const gstCalculation = gstCompliance.calculateGST(
      orderData.amount,
      orderData.category,
      sellerGSTIN && buyerGSTIN && sellerGSTIN.substring(0, 2) === buyerGSTIN.substring(0, 2)
    );

    return {
      invoiceNumber,
      invoiceDate,
      sellerGSTIN,
      buyerGSTIN,
      ...gstCalculation,
      items: orderData.items,
      paymentTerms: 'Advance Payment',
      placeOfSupply: buyerGSTIN ? buyerGSTIN.substring(0, 2) : 'Interstate'
    };
  },

  // Validate GSTIN
  validateGSTIN: (gstin) => {
    if (!gstin || gstin.length !== 15) return false;
    
    const pattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return pattern.test(gstin);
  }
};

// Livestock Welfare Compliance
const livestockWelfare = {
  // Minimum age requirements for sale
  MINIMUM_AGE_REQUIREMENTS: {
    CATTLE: 6, // months
    BUFFALO: 6,
    GOAT: 3,
    SHEEP: 3,
    PIG: 2,
    HORSE: 12,
    DONKEY: 12
  },

  // Health certificate requirements
  HEALTH_CERTIFICATE_REQUIREMENTS: {
    CATTLE: ['Vaccination Certificate', 'Health Certificate', 'Breeding Certificate'],
    BUFFALO: ['Vaccination Certificate', 'Health Certificate', 'Breeding Certificate'],
    GOAT: ['Vaccination Certificate', 'Health Certificate'],
    SHEEP: ['Vaccination Certificate', 'Health Certificate'],
    PIG: ['Vaccination Certificate', 'Health Certificate'],
    HORSE: ['Vaccination Certificate', 'Health Certificate', 'Registration Certificate'],
    DONKEY: ['Vaccination Certificate', 'Health Certificate']
  },

  // Validate livestock listing compliance
  validateListingCompliance: (listing) => {
    const errors = [];
    const warnings = [];

    // Check minimum age
    const minAge = livestockWelfare.MINIMUM_AGE_REQUIREMENTS[listing.species];
    if (listing.livestock_info?.age_months < minAge) {
      errors.push(`Minimum age for ${listing.species} is ${minAge} months`);
    }

    // Check health certificates
    const requiredCerts = livestockWelfare.HEALTH_CERTIFICATE_REQUIREMENTS[listing.species] || [];
    const providedCerts = listing.livestock_info?.health_certificate || [];
    
    requiredCerts.forEach(cert => {
      if (!providedCerts.includes(cert)) {
        warnings.push(`Missing required certificate: ${cert}`);
      }
    });

    // Check vaccination status
    if (!listing.livestock_info?.vaccination_history || 
        listing.livestock_info.vaccination_history.length === 0) {
      warnings.push('Vaccination history not provided');
    }

    // Check transport conditions
    if (listing.livestock_details?.transport_included) {
      if (!listing.livestock_details?.vehicle_type) {
        warnings.push('Transport vehicle type not specified');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  },

  // Generate welfare compliance report
  generateWelfareReport: (listing) => {
    const compliance = livestockWelfare.validateListingCompliance(listing);
    
    return {
      listingId: listing._id,
      species: listing.species,
      complianceStatus: compliance.isValid ? 'COMPLIANT' : 'NON_COMPLIANT',
      errors: compliance.errors,
      warnings: compliance.warnings,
      generatedAt: new Date(),
      recommendations: [
        'Ensure all required health certificates are uploaded',
        'Maintain proper vaccination records',
        'Provide adequate transport conditions',
        'Follow animal welfare guidelines during transport'
      ]
    };
  }
};

// Data Privacy Compliance (GDPR + Indian Data Protection)
const dataPrivacy = {
  // Data categories
  DATA_CATEGORIES: {
    PERSONAL: 'personal',
    SENSITIVE: 'sensitive',
    FINANCIAL: 'financial',
    HEALTH: 'health',
    LOCATION: 'location'
  },

  // Consent types
  CONSENT_TYPES: {
    MARKETING: 'marketing',
    ANALYTICS: 'analytics',
    COOKIES: 'cookies',
    DATA_SHARING: 'data_sharing',
    LOCATION_TRACKING: 'location_tracking'
  },

  // Data retention periods (in days)
  RETENTION_PERIODS: {
    USER_PROFILE: 3650, // 10 years
    TRANSACTION_DATA: 2555, // 7 years
    COMMUNICATION_LOGS: 1095, // 3 years
    ANALYTICS_DATA: 365, // 1 year
    TEMPORARY_DATA: 30 // 30 days
  },

  // Generate privacy policy
  generatePrivacyPolicy: () => {
    return {
      version: '1.0',
      lastUpdated: new Date(),
      dataController: 'AnimalMela Pvt Ltd',
      contactEmail: 'privacy@animalmela.com',
      dataCategories: Object.values(dataPrivacy.DATA_CATEGORIES),
      purposes: [
        'Service provision',
        'User authentication',
        'Transaction processing',
        'Customer support',
        'Legal compliance'
      ],
      legalBasis: [
        'Consent',
        'Contract performance',
        'Legal obligation',
        'Legitimate interest'
      ],
      dataSharing: {
        thirdParties: [
          'Payment processors (Razorpay)',
          'Transport service providers',
          'Insurance providers',
          'Veterinary services'
        ],
        safeguards: [
          'Data processing agreements',
          'Encryption in transit and at rest',
          'Access controls',
          'Regular security audits'
        ]
      },
      userRights: [
        'Right to access',
        'Right to rectification',
        'Right to erasure',
        'Right to data portability',
        'Right to object',
        'Right to restrict processing'
      ]
    };
  },

  // Process data subject request
  processDataSubjectRequest: async (userId, requestType, data) => {
    const requestId = crypto.randomUUID();
    
    const request = {
      requestId,
      userId,
      requestType, // 'access', 'rectification', 'erasure', 'portability', 'object'
      status: 'pending',
      submittedAt: new Date(),
      data,
      estimatedCompletion: moment().add(30, 'days').toDate()
    };

    // Log the request
    console.log('Data Subject Request:', request);

    // Process based on request type
    switch (requestType) {
      case 'access':
        return await dataPrivacy.generateDataExport(userId);
      case 'erasure':
        return await dataPrivacy.processDataErasure(userId);
      case 'portability':
        return await dataPrivacy.generateDataPortability(userId);
      default:
        return { success: true, requestId };
    }
  },

  // Generate data export
  generateDataExport: async (userId) => {
    // Implementation would fetch all user data from database
    return {
      userId,
      exportDate: new Date(),
      dataCategories: Object.values(dataPrivacy.DATA_CATEGORIES),
      format: 'JSON',
      downloadUrl: `/api/privacy/export/${userId}`,
      expiresAt: moment().add(7, 'days').toDate()
    };
  },

  // Process data erasure
  processDataErasure: async (userId) => {
    // Implementation would anonymize or delete user data
    return {
      userId,
      erasureDate: new Date(),
      dataCategories: Object.values(dataPrivacy.DATA_CATEGORIES),
      status: 'completed',
      retentionExceptions: [
        'Transaction records (legal requirement)',
        'Audit logs (security requirement)'
      ]
    };
  },

  // Generate data portability package
  generateDataPortability: async (userId) => {
    return {
      userId,
      exportDate: new Date(),
      format: 'JSON',
      dataTypes: ['profile', 'listings', 'orders', 'messages'],
      downloadUrl: `/api/privacy/portability/${userId}`,
      expiresAt: moment().add(7, 'days').toDate()
    };
  }
};

// Indian E-commerce Compliance
const ecommerceCompliance = {
  // Consumer protection requirements
  CONSUMER_RIGHTS: [
    'Right to information',
    'Right to choose',
    'Right to safety',
    'Right to be heard',
    'Right to seek redressal',
    'Right to consumer education'
  ],

  // Generate terms of service
  generateTermsOfService: () => {
    return {
      version: '1.0',
      lastUpdated: new Date(),
      serviceProvider: 'AnimalMela Pvt Ltd',
      governingLaw: 'Indian Contract Act, 1872',
      jurisdiction: 'Courts in Mumbai, Maharashtra',
      sections: {
        'Service Description': 'Online livestock marketplace platform',
        'User Obligations': [
          'Provide accurate information',
          'Comply with livestock welfare regulations',
          'Maintain account security',
          'Respect other users'
        ],
        'Platform Obligations': [
          'Provide secure platform',
          'Protect user data',
          'Facilitate transactions',
          'Provide customer support'
        ],
        'Payment Terms': [
          'Advance payment required',
          'Refund policy applicable',
          'GST compliance',
          'Secure payment processing'
        ],
        'Dispute Resolution': [
          'Internal mediation',
          'Arbitration',
          'Consumer forum',
          'Legal recourse'
        ],
        'Limitation of Liability': 'Platform liability limited to transaction facilitation'
      }
    };
  },

  // Generate refund policy
  generateRefundPolicy: () => {
    return {
      version: '1.0',
      lastUpdated: new Date(),
      refundEligibility: [
        'Cancellation within 24 hours',
        'Non-delivery of livestock',
        'Significant health issues not disclosed',
        'Fraudulent listing'
      ],
      refundProcess: [
        'Submit refund request',
        'Platform review (48 hours)',
        'Seller response (24 hours)',
        'Refund processing (3-5 business days)'
      ],
      refundAmounts: {
        'Within 24 hours': '100%',
        'Health issues': 'Up to 100%',
        'Non-delivery': '100%',
        'Other cases': 'As per platform policy'
      },
      processingTime: '3-5 business days',
      refundMethods: ['Original payment method', 'Bank transfer']
    };
  },

  // Generate shipping policy
  generateShippingPolicy: () => {
    return {
      version: '1.0',
      lastUpdated: new Date(),
      shippingMethods: [
        'Specialized livestock transport',
        'Seller delivery',
        'Third-party logistics'
      ],
      deliveryTimeframes: {
        'Local (within 50km)': '1-2 days',
        'Regional (within 200km)': '2-3 days',
        'National': '3-7 days'
      },
      shippingCosts: 'As per transport service provider',
      insurance: 'Included in transport service',
      tracking: 'Real-time tracking available',
      deliveryConditions: [
        'Proper ventilation',
        'Adequate space',
        'Health monitoring',
        'Emergency contact'
      ]
    };
  }
};

// Compliance monitoring and reporting
const complianceMonitoring = {
  // Generate compliance report
  generateComplianceReport: async (dateRange) => {
    const report = {
      reportId: crypto.randomUUID(),
      generatedAt: new Date(),
      dateRange,
      gstCompliance: {
        totalTransactions: 0,
        gstCollected: 0,
        compliantTransactions: 0,
        nonCompliantTransactions: 0
      },
      livestockWelfare: {
        totalListings: 0,
        compliantListings: 0,
        warningsIssued: 0,
        violationsDetected: 0
      },
      dataPrivacy: {
        dataSubjectRequests: 0,
        completedRequests: 0,
        pendingRequests: 0,
        dataBreaches: 0
      },
      ecommerceCompliance: {
        totalOrders: 0,
        refundRequests: 0,
        disputesResolved: 0,
        customerComplaints: 0
      }
    };

    return report;
  },

  // Monitor compliance metrics
  monitorCompliance: async () => {
    const metrics = {
      timestamp: new Date(),
      gstComplianceRate: 0,
      welfareComplianceRate: 0,
      privacyRequestResponseTime: 0,
      customerSatisfactionScore: 0
    };

    return metrics;
  }
};

// Export all compliance modules
module.exports = {
  gstCompliance,
  livestockWelfare,
  dataPrivacy,
  ecommerceCompliance,
  complianceMonitoring
};
