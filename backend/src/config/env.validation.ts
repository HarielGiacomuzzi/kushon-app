import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EnvironmentValidation {
  private static readonly logger = new Logger(EnvironmentValidation.name);

  static validate() {
    this.logger.log('🔍 Validating environment variables...');

    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_FROM',
      'FRONTEND_URL'
    ];

    // Log environment info
    this.logger.log(`📦 Node Environment: ${process.env.NODE_ENV || 'development'}`);
    this.logger.log(`🚀 Port: ${process.env.PORT || 3000}`);

    // Check DATABASE_URL specifically
    if (process.env.DATABASE_URL) {
      const maskedDbUrl = this.maskDatabaseUrl(process.env.DATABASE_URL);
      this.logger.log(`🗄️  DATABASE_URL: ${maskedDbUrl}`);

      // Extract database info
      const dbInfo = this.extractDbInfo(process.env.DATABASE_URL);
      if (dbInfo) {
        this.logger.log(`   └─ Host: ${dbInfo.host}`);
        this.logger.log(`   └─ Port: ${dbInfo.port}`);
        this.logger.log(`   └─ Database: ${dbInfo.database}`);
        this.logger.log(`   └─ User: ${dbInfo.user}`);
      }
    } else {
      this.logger.error('❌ DATABASE_URL is not set!');
    }

    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missing.length > 0) {
      this.logger.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file and ensure all required variables are set.'
      );
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      this.logger.error('❌ JWT_SECRET must be at least 32 characters long');
      throw new Error('JWT_SECRET must be at least 32 characters long for security');
    }

    this.logger.log('✅ All required environment variables are configured');
  }

  private static maskDatabaseUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      if (urlObj.password) {
        urlObj.password = '***';
      }
      return urlObj.toString();
    } catch {
      return '[Invalid URL format]';
    }
  }

  private static extractDbInfo(url: string): { host: string; port: string; database: string; user: string } | null {
    try {
      const urlObj = new URL(url);
      return {
        host: urlObj.hostname,
        port: urlObj.port || '5432',
        database: urlObj.pathname.split('/')[1]?.split('?')[0] || 'unknown',
        user: urlObj.username || 'unknown'
      };
    } catch {
      return null;
    }
  }
}