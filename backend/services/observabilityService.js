// Observability Module for AnimalMela - Logs, Metrics, Audit Trails
const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, errors, json, printf, colorize } = format;
const prometheus = require('prom-client');
const crypto = require('crypto');

// Prometheus metrics
const register = new prometheus.Registry();

// Custom metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeUsers = new prometheus.Gauge({
  name: 'active_users_total',
  help: 'Number of active users'
});

const listingsTotal = new prometheus.Gauge({
  name: 'listings_total',
  help: 'Total number of listings'
});

const ordersTotal = new prometheus.Counter({
  name: 'orders_total',
  help: 'Total number of orders',
  labelNames: ['status']
});

const revenueTotal = new prometheus.Counter({
  name: 'revenue_total',
  help: 'Total revenue generated',
  labelNames: ['currency']
});

const errorRate = new prometheus.Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'severity']
});

const databaseConnections = new prometheus.Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections'
});

const cacheHitRate = new prometheus.Counter({
  name: 'cache_hits_total',
  help: 'Total cache hits',
  labelNames: ['cache_type']
});

const cacheMissRate = new prometheus.Counter({
  name: 'cache_misses_total',
  help: 'Total cache misses',
  labelNames: ['cache_type']
});

// Register metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeUsers);
register.registerMetric(listingsTotal);
register.registerMetric(ordersTotal);
register.registerMetric(revenueTotal);
register.registerMetric(errorRate);
register.registerMetric(databaseConnections);
register.registerMetric(cacheHitRate);
register.registerMetric(cacheMissRate);

// Winston logger configuration
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: { service: 'animalmela-api' },
  transports: [
    // Console transport
    new transports.Console({
      format: combine(
        colorize(),
        printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
        })
      )
    }),
    
    // File transports
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Audit log file
    new transports.File({ 
      filename: 'logs/audit.log',
      level: 'info',
      maxsize: 10485760, // 10MB
      maxFiles: 10
    })
  ]
});

// Structured logging utilities
const logUtils = {
  // Log API requests
  logRequest: (req, res, responseTime) => {
    const logData = {
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id || null,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: res.get('Content-Length') || 0
    };

    // Update metrics
    httpRequestDuration.observe(
      { method: req.method, route: req.route?.path || req.url, status_code: res.statusCode },
      responseTime / 1000
    );
    httpRequestTotal.inc({ method: req.method, route: req.route?.path || req.url, status_code: res.statusCode });

    if (res.statusCode >= 400) {
      logger.error('HTTP Request Error', logData);
      errorRate.inc({ type: 'http_error', severity: res.statusCode >= 500 ? 'high' : 'medium' });
    } else {
      logger.info('HTTP Request', logData);
    }
  },

  // Log authentication events
  logAuth: (event, userId, ip, userAgent, success, reason = '') => {
    const logData = {
      event,
      userId,
      ip,
      userAgent,
      success,
      reason,
      timestamp: new Date()
    };

    logger.info('Authentication Event', logData);
    
    if (!success) {
      errorRate.inc({ type: 'auth_error', severity: 'medium' });
    }
  },

  // Log business events
  logBusinessEvent: (event, data) => {
    const logData = {
      event,
      ...data,
      timestamp: new Date()
    };

    logger.info('Business Event', logData);
  },

  // Log security events
  logSecurityEvent: (event, severity, data) => {
    const logData = {
      event,
      severity,
      ...data,
      timestamp: new Date()
    };

    logger.warn('Security Event', logData);
    errorRate.inc({ type: 'security_event', severity });
  },

  // Log performance metrics
  logPerformance: (operation, duration, metadata = {}) => {
    const logData = {
      operation,
      duration: `${duration}ms`,
      ...metadata,
      timestamp: new Date()
    };

    logger.info('Performance Metric', logData);
  },

  // Log database operations
  logDatabase: (operation, collection, duration, success, error = null) => {
    const logData = {
      operation,
      collection,
      duration: `${duration}ms`,
      success,
      error: error?.message || null,
      timestamp: new Date()
    };

    if (success) {
      logger.debug('Database Operation', logData);
    } else {
      logger.error('Database Error', logData);
      errorRate.inc({ type: 'database_error', severity: 'high' });
    }
  }
};

// Audit trail system
const auditTrail = {
  // Log user actions
  logUserAction: (userId, action, resource, resourceId, metadata = {}) => {
    const auditEntry = {
      auditId: crypto.randomUUID(),
      userId,
      action,
      resource,
      resourceId,
      metadata,
      timestamp: new Date(),
      ip: metadata.ip || null,
      userAgent: metadata.userAgent || null
    };

    logger.info('Audit Trail - User Action', auditEntry);
    
    // Store in database for compliance
    // await AuditLog.create(auditEntry);
  },

  // Log system events
  logSystemEvent: (event, severity, metadata = {}) => {
    const auditEntry = {
      auditId: crypto.randomUUID(),
      event,
      severity,
      metadata,
      timestamp: new Date(),
      system: 'animalmela-api'
    };

    logger.info('Audit Trail - System Event', auditEntry);
  },

  // Log data access
  logDataAccess: (userId, dataType, operation, metadata = {}) => {
    const auditEntry = {
      auditId: crypto.randomUUID(),
      userId,
      dataType,
      operation,
      metadata,
      timestamp: new Date(),
      ip: metadata.ip || null
    };

    logger.info('Audit Trail - Data Access', auditEntry);
  },

  // Log compliance events
  logComplianceEvent: (event, complianceType, metadata = {}) => {
    const auditEntry = {
      auditId: crypto.randomUUID(),
      event,
      complianceType,
      metadata,
      timestamp: new Date()
    };

    logger.info('Audit Trail - Compliance Event', auditEntry);
  }
};

// Health check system
const healthCheck = {
  // Check database health
  checkDatabase: async () => {
    try {
      const start = Date.now();
      // Implementation would check database connection
      const duration = Date.now() - start;
      
      logUtils.logDatabase('health_check', 'database', duration, true);
      
      return {
        status: 'healthy',
        responseTime: duration,
        timestamp: new Date()
      };
    } catch (error) {
      logUtils.logDatabase('health_check', 'database', 0, false, error);
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date()
      };
    }
  },

  // Check Redis health
  checkRedis: async () => {
    try {
      const start = Date.now();
      // Implementation would check Redis connection
      const duration = Date.now() - start;
      
      return {
        status: 'healthy',
        responseTime: duration,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date()
      };
    }
  },

  // Check external services
  checkExternalServices: async () => {
    const services = {
      paymentGateway: await checkPaymentGateway(),
      emailService: await checkEmailService(),
      smsService: await checkSMSService(),
      storageService: await checkStorageService()
    };

    return services;
  },

  // Overall health check
  getOverallHealth: async () => {
    const checks = {
      database: await healthCheck.checkDatabase(),
      redis: await healthCheck.checkRedis(),
      externalServices: await healthCheck.checkExternalServices()
    };

    const overallStatus = Object.values(checks).every(check => 
      check.status === 'healthy' || 
      (typeof check === 'object' && Object.values(check).every(svc => svc.status === 'healthy'))
    ) ? 'healthy' : 'unhealthy';

    return {
      status: overallStatus,
      checks,
      timestamp: new Date()
    };
  }
};

// Helper functions for external service checks
const checkPaymentGateway = async () => {
  try {
    // Implementation would check payment gateway
    return { status: 'healthy', responseTime: 100 };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

const checkEmailService = async () => {
  try {
    // Implementation would check email service
    return { status: 'healthy', responseTime: 200 };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

const checkSMSService = async () => {
  try {
    // Implementation would check SMS service
    return { status: 'healthy', responseTime: 150 };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

const checkStorageService = async () => {
  try {
    // Implementation would check storage service
    return { status: 'healthy', responseTime: 300 };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

// Metrics collection utilities
const metricsUtils = {
  // Update user metrics
  updateUserMetrics: (totalUsers, activeUsers) => {
    activeUsers.set(activeUsers);
    // listingsTotal.set(totalListings);
  },

  // Update order metrics
  updateOrderMetrics: (orderStatus, amount, currency = 'INR') => {
    ordersTotal.inc({ status: orderStatus });
    if (amount > 0) {
      revenueTotal.inc({ currency }, amount);
    }
  },

  // Update cache metrics
  updateCacheMetrics: (cacheType, hit) => {
    if (hit) {
      cacheHitRate.inc({ cache_type: cacheType });
    } else {
      cacheMissRate.inc({ cache_type: cacheType });
    }
  },

  // Update database connection metrics
  updateDatabaseMetrics: (activeConnections) => {
    databaseConnections.set(activeConnections);
  },

  // Get all metrics
  getAllMetrics: async () => {
    return await register.metrics();
  },

  // Get metrics in JSON format
  getMetricsJSON: async () => {
    return await register.getMetricsAsJSON();
  }
};

// Alerting system
const alerting = {
  // Send alert
  sendAlert: (severity, message, metadata = {}) => {
    const alert = {
      alertId: crypto.randomUUID(),
      severity,
      message,
      metadata,
      timestamp: new Date()
    };

    logger.error('Alert Triggered', alert);
    
    // Send to monitoring system (e.g., PagerDuty, Slack)
    // Implementation would integrate with alerting service
  },

  // Check alert conditions
  checkAlertConditions: async () => {
    const conditions = {
      errorRate: await checkErrorRate(),
      responseTime: await checkResponseTime(),
      databaseConnections: await checkDatabaseConnections(),
      memoryUsage: await checkMemoryUsage()
    };

    // Trigger alerts based on conditions
    Object.entries(conditions).forEach(([metric, value]) => {
      if (value.thresholdExceeded) {
        alerting.sendAlert('warning', `${metric} threshold exceeded`, { metric, value });
      }
    });
  }
};

// Helper functions for alert conditions
const checkErrorRate = async () => {
  // Implementation would check error rate
  return { current: 0.01, threshold: 0.05, thresholdExceeded: false };
};

const checkResponseTime = async () => {
  // Implementation would check response time
  return { current: 200, threshold: 1000, thresholdExceeded: false };
};

const checkDatabaseConnections = async () => {
  // Implementation would check database connections
  return { current: 10, threshold: 50, thresholdExceeded: false };
};

const checkMemoryUsage = async () => {
  // Implementation would check memory usage
  return { current: 0.7, threshold: 0.9, thresholdExceeded: false };
};

// Export all observability utilities
module.exports = {
  logger,
  logUtils,
  auditTrail,
  healthCheck,
  metricsUtils,
  alerting,
  register,
  // Individual metrics for direct access
  httpRequestDuration,
  httpRequestTotal,
  activeUsers,
  listingsTotal,
  ordersTotal,
  revenueTotal,
  errorRate,
  databaseConnections,
  cacheHitRate,
  cacheMissRate
};
