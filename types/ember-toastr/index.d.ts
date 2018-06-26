declare module 'ember-toastr/services/toast' {
    import Service from '@ember/service';

    export default class Toast extends Service {
        success(message: string, title?: string, options?: any): void;
        error(message: string, title?: string, options?: any): void;
        info(message: string, title?: string, options?: any): void;
    }
}
