import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {HttpException, HttpStatus, ValidationPipe} from "@nestjs/common";
import {
    SwaggerModule,
    DocumentBuilder,
    SwaggerDocumentOptions
} from "@nestjs/swagger";
import {NestExpressApplication} from "@nestjs/platform-express";
import {join} from "path";
import {AllExceptionFilter} from "./exceptions/errors.filter";
const crypto = require("crypto")

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    app.useStaticAssets(join(__dirname, "..", "public"), {
        prefix: "/public/"
    });
    app.setViewEngine('hbs');
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix("v2");
    app.useGlobalFilters(new AllExceptionFilter());
    const config = new DocumentBuilder()
        .setTitle("Trades Trek")
        .setDescription("Trades Trek V2 API Documentation")
        .setVersion("2.0")
        .build();

    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) =>
            controllerKey + "-" + methodKey
    };
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup("v2/docs", app, document);
    await app.listen(process.env.PORT ?? 3000);

}



bootstrap();
