/**
 * Basic health check tests for the backend API
 */

describe('Backend Health Checks', () => {
  test('should have required environment variables defined', () => {
    // Test that critical environment variables are available
    expect(process.env.NODE_ENV).toBeDefined();
  });

  test('should have valid package.json configuration', () => {
    const packageJson = require('../package.json');
    
    expect(packageJson.name).toBe('animall-backend');
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
    expect(packageJson.dependencies['mongoose']).toBeDefined();
    expect(packageJson.dependencies['bcryptjs']).toBeDefined();
    expect(packageJson.dependencies['jsonwebtoken']).toBeDefined();
  });

  test('should have models directory structure', () => {
    const fs = require('fs');
    const path = require('path');
    
    const modelsPath = path.join(__dirname, '../models');
    expect(fs.existsSync(modelsPath)).toBe(true);
    
    const indexPath = path.join(modelsPath, 'index.js');
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  test('should have lib directory with required utilities', () => {
    const fs = require('fs');
    const path = require('path');
    
    const libPath = path.join(__dirname, '../lib');
    expect(fs.existsSync(libPath)).toBe(true);
    
    // Check for critical lib files
    expect(fs.existsSync(path.join(libPath, 'mongodb.js'))).toBe(true);
    expect(fs.existsSync(path.join(libPath, 'jwt.js'))).toBe(true);
    expect(fs.existsSync(path.join(libPath, 'auth.js'))).toBe(true);
  });
});
