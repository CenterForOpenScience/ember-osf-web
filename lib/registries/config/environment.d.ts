declare const config: {
    environment: any;
    hostAppName: string;
    indexPageRegistrationIds: string[];
    modulePrefix: string;
    shareBaseUrl: string;
    shareSearchUrl: string;
    externalRegistries: Array<{
        name: string;
        https: boolean;
        urlRegex: string;
        display?: string;
    }>;
    externalLinks: {
        help: string;
        donate: string;
    };
    defaultProviderId: string;
};

export default config;
