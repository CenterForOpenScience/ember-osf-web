declare module 'ember-cookies/services/cookies' {
    import Service from '@ember/service';

    interface ReadOptions {
        raw?: boolean;
    }

    interface WriteOptions {
        domain?: string;
        expires?: Date;
        maxAge?: number;
        path?: string;
        secure?: boolean;
        raw?: boolean;
    }

    interface ClearOptions {
        domain?: string;
        path?: string;
        secure?: boolean;
    }

    export default class Cookies extends Service {
        read(cookieName: string, options?: ReadOptions): string;
        write(cookieName: string, value: any, options?: WriteOptions): void;
        clear(cookieName: string, options?: ClearOptions): void;
        exists(cookieName: string): boolean;
    }
}
