/**
 * Basic health check tests for the frontend application
 */

describe('Frontend Health Checks', () => {
  test('should have required environment variables defined', () => {
    // Test that critical environment variables are available
    expect(process.env.NODE_ENV).toBeDefined();
  });

  test('should have valid package.json configuration', () => {
    const packageJson = require('../package.json');
    
    expect(packageJson.name).toBe('animall-web-frontend');
    expect(packageJson.version).toBeDefined();
    expect(packageJson.scripts).toBeDefined();
    expect(packageJson.scripts.dev).toBeDefined();
    expect(packageJson.scripts.build).toBeDefined();
    expect(packageJson.scripts.start).toBeDefined();
  });

  test('should have required dependencies', () => {
    const packageJson = require('../package.json');
    
    // Check for critical dependencies
    expect(packageJson.dependencies).toBeDefined();
    expect(packageJson.dependencies['next']).toBeDefined();
    expect(packageJson.dependencies['react']).toBeDefined();
    expect(packageJson.dependencies['react-dom']).toBeDefined();
  });

  test('should have API routes (App Router src/app/api or legacy pages/api)', () => {
    const fs = require('fs');
    const path = require('path');

    const appRouterApi = path.join(__dirname, '../src/app/api');
    const pagesApi = path.join(__dirname, '../pages/api');
    expect(fs.existsSync(appRouterApi) || fs.existsSync(pagesApi)).toBe(true);
  });

  test('should have src directory structure', () => {
    const fs = require('fs');
    const path = require('path');
    
    const srcPath = path.join(__dirname, '../src');
    expect(fs.existsSync(srcPath)).toBe(true);
  });

  test('should have Next.js configuration', () => {
    const fs = require('fs');
    const path = require('path');
    
    const nextConfigPath = path.join(__dirname, '../next.config.js');
    expect(fs.existsSync(nextConfigPath)).toBe(true);
    
    const nextConfig = require('../next.config.js');
    expect(nextConfig).toBeDefined();
    expect(nextConfig.output).toBe('standalone');
  });

  test('next.config should redirect legacy /marketplace/products to kisaan hub', () => {
    const fs = require('fs');
    const path = require('path');
    const raw = fs.readFileSync(path.join(__dirname, '../next.config.js'), 'utf8');
    expect(raw).toMatch(/\/marketplace\/products/);
    expect(raw).toMatch(/\/marketplace\/kisaan\/products/);
  });
});
