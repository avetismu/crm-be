import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as packageConfig from  '../package.json';
import { INestApplication } from "@nestjs/common";

export const generateDocument = (app: INestApplication) => {

    const options = new DocumentBuilder()
    .setTitle(packageConfig.name)
    .setDescription(packageConfig.description)
    .setVersion(packageConfig.version)
    .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api/v1.0/docs', app, document);
}
    
