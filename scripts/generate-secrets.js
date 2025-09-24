#!/usr/bin/env node
// scripts/generate-secrets.js
const crypto = require('crypto');

console.log('🔐 WildGuard API - Secure Environment Variables Generator');
console.log('========================================================\n');

// Generate JWT secrets
const devJwtSecret = crypto.randomBytes(64).toString('hex');
const prodJwtSecret = crypto.randomBytes(64).toString('hex');
const testJwtSecret = crypto.randomBytes(64).toString('hex');

// Generate API keys (example format)
const webhookSecret = crypto.randomBytes(32).toString('hex');
const encryptionKey = crypto.randomBytes(32).toString('hex');

console.log('📝 Copy these secure values to your environment files:\n');

console.log('🚀 DEVELOPMENT (.env):');
console.log('======================');
console.log(`JWT_SECRET=${devJwtSecret}`);
console.log(`WEBHOOK_SECRET=${webhookSecret}`);
console.log(`ENCRYPTION_KEY=${encryptionKey}\n`);

console.log('🏭 PRODUCTION (.env.production):');
console.log('=================================');
console.log(`JWT_SECRET=${prodJwtSecret}`);
console.log(`WEBHOOK_SECRET=${crypto.randomBytes(32).toString('hex')}`);
console.log(`ENCRYPTION_KEY=${crypto.randomBytes(32).toString('hex')}\n`);

console.log('🧪 TEST (.env.test):');
console.log('====================');
console.log(`JWT_SECRET=${testJwtSecret}`);
console.log(`WEBHOOK_SECRET=${crypto.randomBytes(32).toString('hex')}`);
console.log(`ENCRYPTION_KEY=${crypto.randomBytes(32).toString('hex')}\n`);

console.log('🔒 Security Notes:');
console.log('==================');
console.log('✅ All secrets are cryptographically secure (256+ bits)');
console.log('✅ Each environment has unique secrets');
console.log('✅ JWT secrets are 128 characters (512 bits)');
console.log('✅ Never commit these values to version control');
console.log('✅ Store production secrets in secure environment variables\n');

console.log('📋 Additional Security Recommendations:');
console.log('=======================================');
console.log('• Use environment variable injection for production deployment');
console.log('• Rotate secrets regularly (recommended: every 90 days)');
console.log('• Use different database credentials for each environment');
console.log('• Enable database SSL/TLS connections in production');
console.log('• Set up monitoring for failed authentication attempts');
console.log('• Consider using a secrets management service (AWS Secrets Manager, etc.)');

console.log('\n🎉 Secrets generated successfully!');
console.log('Run this script anytime to generate new secure values.');