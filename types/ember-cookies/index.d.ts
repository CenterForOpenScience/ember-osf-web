declare module 'ember-cookies/services/cookies' {
    import Service from '@ember/service';

    export default class Cookies extends Service {
        read(cookieName: string): string;
        clear(cookieName: string, extra: object): void;
    }
}
