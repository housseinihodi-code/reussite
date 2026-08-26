declare const _default: () => {
    env: string;
    port: number;
    apiPrefix: string;
    corsOrigins: string[];
    database: {
        url: string | undefined;
    };
    jwt: {
        accessSecret: string | undefined;
        accessExpiresIn: string;
        refreshSecret: string | undefined;
        refreshExpiresIn: string;
    };
    stripe: {
        secretKey: string | undefined;
        webhookSecret: string | undefined;
    };
    paypal: {
        clientId: string | undefined;
        clientSecret: string | undefined;
    };
    upload: {
        driver: string;
        dir: string;
        s3: {
            bucket: string | undefined;
            region: string | undefined;
            accessKeyId: string | undefined;
            secretAccessKey: string | undefined;
        };
    };
    mail: {
        host: string | undefined;
        port: number;
        user: string | undefined;
        password: string | undefined;
        from: string;
        contactTo: string;
    };
    throttle: {
        ttl: number;
        limit: number;
    };
};
export default _default;
