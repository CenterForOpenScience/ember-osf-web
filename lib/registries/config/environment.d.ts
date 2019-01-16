declare const config: {
    environment: any;
    hostAppName: string;
    indexPageRegistrationsQuery: string;
    modulePrefix: string;
    shareBaseURL: string;
    shareSearchBaseURL: string;
    sourcesWhitelist: Array<{
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
