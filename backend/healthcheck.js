const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET',
  timeout: 3000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('Backend health check passed');
    process.exit(0);
  } else {
    console.log(`Backend health check failed with status: ${res.statusCode}`);
    process.exit(1);
  }
});

req.on('error', (error) => {
  console.log(`Backend health check failed with error: ${error.message}`);
  process.exit(1);
});

req.on('timeout', () => {
  console.log('Backend health check timed out');
  req.destroy();
  process.exit(1);
});

req.end();