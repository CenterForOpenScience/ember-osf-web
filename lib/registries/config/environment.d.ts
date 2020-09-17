declare const config: {
    environment: any;
    hostAppName: string;
    indexPageRegistrationIds: string[];
    modulePrefix: string;
    shareBaseURL: string;
    shareSearchBaseURL: string;
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
};

export default config;
