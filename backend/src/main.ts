import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { EnvironmentValidation } from './config/env.validation';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  logger.log('🚀 Starting Kushon Backend Application...');
  logger.log('═'.repeat(60));

  // Validate environment variables
  EnvironmentValidation.validate();

  logger.log('🏗️  Creating NestJS application...');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Static assets
  const uploadsPath = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });
  logger.log(`📁 Static files directory: ${uploadsPath}`);

  // CORS Configuration
  const corsOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    /\.railway\.app$/,
    /\.vercel\.app$/,
    /\.herokuapp\.com$/,
  ];
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  logger.log('🌐 CORS enabled for: localhost, railway.app, vercel.app, herokuapp.com');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  logger.log('✅ Global validation pipe configured');

  // Global prefix for all routes
  app.setGlobalPrefix('api');
  logger.log('🔌 API prefix: /api');

  // Serve frontend static files (for production deployment)
  const frontendPath = join(process.cwd(), '..', 'frontend', 'dist');
  const fs = require('fs');

  if (fs.existsSync(frontendPath)) {
    app.useStaticAssets(frontendPath);
    app.setBaseViewsDir(frontendPath);

    // Serve index.html for all non-API routes (SPA support)
    app.use((req: any, res: any, next: any) => {
      if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
        res.sendFile(join(frontendPath, 'index.html'));
      } else {
        next();
      }
    });

    logger.log(`🌐 Frontend static files: ${frontendPath}`);
    logger.log('✅ Serving frontend application (SPA mode)');
  } else {
    logger.warn(`⚠️  Frontend build not found at: ${frontendPath}`);
    logger.warn('   Frontend will not be served. Run `npm run build` in frontend directory.');
  }

  // Start server
  const port = process.env.PORT || 3000;
  const host = '0.0.0.0'; // Bind to all interfaces for Heroku
  await app.listen(port, host);

  logger.log('═'.repeat(60));
  logger.log(`✅ Kushon Backend is running!`);
  logger.log(`🌍 Server listening on: http://0.0.0.0:${port}`);
  logger.log(`🔗 API Base URL: http://0.0.0.0:${port}/api`);
  logger.log(`📁 Static files: http://0.0.0.0:${port}/uploads`);
  logger.log('═'.repeat(60));

  // Log all registered routes
  logRoutes(app, logger);
}

function logRoutes(app: NestExpressApplication, logger: Logger) {
  const server: any = app.getHttpServer();
  const router = server._events?.request?._router;

  logger.log('📋 Registered Routes:');
  logger.log('─'.repeat(60));

  const routes = [];

  if (router && router.stack) {
    router.stack.forEach((layer: any) => {
      if (layer.route) {
        const path = layer.route.path;
        const methods = Object.keys(layer.route.methods)
          .filter(method => layer.route.methods[method])
          .map(method => method.toUpperCase());

        methods.forEach(method => {
          routes.push({ method, path });
        });
      } else if (layer.name === 'router' && layer.handle.stack) {
        const prefix = layer.regexp.source
          .replace('^\\/api\\/?', '/api/')
          .replace('\\/?(?=\\/|$)', '')
          .replace(/\\/g, '');

        layer.handle.stack.forEach((innerLayer: any) => {
          if (innerLayer.route) {
            const path = prefix + innerLayer.route.path;
            const methods = Object.keys(innerLayer.route.methods)
              .filter(method => innerLayer.route.methods[method])
              .map(method => method.toUpperCase());

            methods.forEach(method => {
              routes.push({ method, path });
            });
          }
        });
      }
    });
  }

  // Sort routes by path
  routes.sort((a, b) => a.path.localeCompare(b.path));

  // Group routes by controller
  const groupedRoutes: { [key: string]: typeof routes } = {};
  routes.forEach(route => {
    const parts = route.path.split('/').filter(Boolean);
    const controller = parts.length > 1 ? parts[1] : 'root';
    if (!groupedRoutes[controller]) {
      groupedRoutes[controller] = [];
    }
    groupedRoutes[controller].push(route);
  });

  // Log grouped routes
  Object.keys(groupedRoutes).forEach(controller => {
    logger.log(`\n  📦 /${controller}`);
    groupedRoutes[controller].forEach(route => {
      const methodColor = route.method === 'GET' ? '🔵' :
                         route.method === 'POST' ? '🟢' :
                         route.method === 'PUT' ? '🟡' :
                         route.method === 'DELETE' ? '🔴' :
                         route.method === 'PATCH' ? '🟠' : '⚪';
      logger.log(`    ${methodColor} ${route.method.padEnd(6)} ${route.path}`);
    });
  });

  logger.log('─'.repeat(60));
  logger.log(`✅ Total routes registered: ${routes.length}`);
  logger.log('═'.repeat(60));
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('❌ Failed to start application:');
  logger.error(error.message);
  logger.error(error.stack);
  process.exit(1);
});
