import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentValidation {
  static validate() {
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_FROM',
      'FRONTEND_URL'
    ];

    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file and ensure all required variables are set.'
      );
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long for security');
    }

    console.log('✓ All required environment variables are configured');
  }
}