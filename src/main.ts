import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';
// core
import { createWriteStream } from 'fs';
import { get } from 'http';
import { configNestApp } from './config.main';
import cookieParser from 'cookie-parser';

const serverUrl = 'http://localhost:5000';
const options = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
    withCredentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
};

async function bootstrap() {
    const baseApp = await NestFactory.create(AppModule);
    const app = configNestApp(baseApp);

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Inctagram API')
        .setDescription('Powerfull team should use this api to develop the best Inctagramm app.' + ' ' + 'Base URL is https://it-team2-backend-mirror.vercel.app')
        .setVersion('02_week')
        .addBearerAuth()
        .addCookieAuth('refreshToken')
        .build();

    const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('swagger', app, swaggerDoc);

    app.use(cookieParser());
    app.enableCors(options);
    await app.listen(3000);

    // get the swagger json file (if app is running in development mode)
    if (process.env.NODE_ENV === 'development') {
        // write swagger ui files
        get(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
            response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
            console.log(`Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`);
        });

        get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
            response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
            console.log(`Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`);
        });

        get(`${serverUrl}/swagger/swagger-ui-standalone-preset.js`, function (response) {
            response.pipe(createWriteStream('swagger-static/swagger-ui-standalone-preset.js'));
            console.log(`Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`);
        });

        get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
            response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
            console.log(`Swagger UI css file written to: '/swagger-static/swagger-ui.css'`);
        });
    }
}

bootstrap();
