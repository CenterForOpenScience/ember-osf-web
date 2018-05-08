declare module 'ember-toastr/services/toast' {
    import Service from '@ember/service';

    export default class Toast extends Service {
        success(message: string, title?: string): void;
        error(message: string, title?: string): void;
        info(message: string, title?: string): void;
    }
}
