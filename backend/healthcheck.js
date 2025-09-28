const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 5000,
  path: '/api/health',
  method: 'GET',
  timeout: 3000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('Backend health check: OK');
    process.exit(0);
  } else {
    console.log(`Backend health check failed: ${res.statusCode}`);
    process.exit(1);
  }
});

req.on('error', (err) => {
  console.log('Backend health check error:', err.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.log('Backend health check timeout');
  req.destroy();
  process.exit(1);
});

req.setTimeout(3000);
req.end();