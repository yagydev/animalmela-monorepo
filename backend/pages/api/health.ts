// Health Check and Metrics API endpoints
import { NextApiRequest, NextApiResponse } from 'next';

// Health check endpoint
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    return handleHealthCheck(req, res);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${method} Not Allowed`);
}

async function handleHealthCheck(req: NextApiRequest, res: NextApiResponse) {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: await checkDatabaseHealth(),
        redis: await checkRedisHealth(),
        externalServices: await checkExternalServices(),
        memory: checkMemoryUsage(),
        disk: checkDiskUsage()
      }
    };

    // Determine overall health
    const allHealthy = Object.values(healthStatus.checks).every(check => 
      typeof check === 'object' ? check.status === 'healthy' : check === 'healthy'
    );

    healthStatus.status = allHealthy ? 'healthy' : 'unhealthy';

    const statusCode = allHealthy ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
}

async function checkDatabaseHealth() {
  try {
    const start = Date.now();
    // Simulate database check
    await new Promise(resolve => setTimeout(resolve, 10));
    const responseTime = Date.now() - start;

    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      connectionPool: 'active'
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

async function checkRedisHealth() {
  try {
    const start = Date.now();
    // Simulate Redis check
    await new Promise(resolve => setTimeout(resolve, 5));
    const responseTime = Date.now() - start;

    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      memory: '64MB used'
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

async function checkExternalServices() {
  const services = {
    paymentGateway: await checkPaymentGateway(),
    emailService: await checkEmailService(),
    smsService: await checkSMSService(),
    storageService: await checkStorageService()
  };

  return services;
}

async function checkPaymentGateway() {
  try {
    // Simulate payment gateway check
    await new Promise(resolve => setTimeout(resolve, 20));
    return { status: 'healthy', responseTime: '20ms' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkEmailService() {
  try {
    // Simulate email service check
    await new Promise(resolve => setTimeout(resolve, 15));
    return { status: 'healthy', responseTime: '15ms' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkSMSService() {
  try {
    // Simulate SMS service check
    await new Promise(resolve => setTimeout(resolve, 25));
    return { status: 'healthy', responseTime: '25ms' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkStorageService() {
  try {
    // Simulate storage service check
    await new Promise(resolve => setTimeout(resolve, 30));
    return { status: 'healthy', responseTime: '30ms' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

function checkMemoryUsage() {
  const memUsage = process.memoryUsage();
  const totalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  const usedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const usagePercent = Math.round((usedMB / totalMB) * 100);

  return {
    status: usagePercent < 90 ? 'healthy' : 'warning',
    total: `${totalMB}MB`,
    used: `${usedMB}MB`,
    percentage: `${usagePercent}%`
  };
}

function checkDiskUsage() {
  // Simulate disk usage check
  const usage = Math.random() * 100;
  return {
    status: usage < 90 ? 'healthy' : 'warning',
    percentage: `${Math.round(usage)}%`,
    free: `${Math.round(100 - usage)}%`
  };
}
