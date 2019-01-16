declare module '@ember/routing/api' {
    export interface EmberLocation {
        implementation: string;
        cancelRouterSetup?: boolean;
        getURL(): string;
        setURL(path: string): void;
        replaceURL?(path: string): void;
        onUpdateURL(callback: (url: string) => void): void;
        formatURL(url: string): string;
        detect?(): void;
        initState?(): void;
    }
}
