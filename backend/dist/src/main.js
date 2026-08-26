"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
process.env.TS_NODE_BASEURL = (0, path_1.join)(__dirname);
require("tsconfig-paths/register");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./interceptors/transform.interceptor");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: false, rawBody: true });
    const config = app.get(config_1.ConfigService);
    const apiPrefix = config.get('API_PREFIX', 'api/v1');
    app.setGlobalPrefix(apiPrefix);
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: config.get('CORS_ORIGINS', '*').split(','),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new transform_interceptor_1.TransformInterceptor());
    const port = config.get('PORT', 4000);
    await app.listen(port);
    console.log(`Fast Deals Auto API running on http://localhost:${port}/${apiPrefix}`);
}
bootstrap();
//# sourceMappingURL=main.js.map