declare module 'ember-toastr/services/toast' {
    import Service from '@ember/service';

    export default class Toast extends Service {
        success(message: string): void;
        error(message: string): void;
    }
}
