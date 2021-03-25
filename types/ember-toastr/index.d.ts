declare module 'ember-toastr/services/toast' {
    import Service from '@ember/service';
    import { SafeString } from '@ember/template/-private/handlebars';
    import { ToastOptions } from '@types/toastr';

    export default class Toast extends Service {
        error(message: string | SafeString, title?: string | SafeString, options?: Partial<ToastOptions>): void;
        info(message: string | SafeString, title?: string | SafeString, options?: Partial<ToastOptions>): void;
        success(message: string | SafeString, title?: string | SafeString, options?: Partial<ToastOptions>): void;
        warning(message: string | SafeString, title?: string | SafeString, options?: Partial<ToastOptions>): void;
    }
}

interface Window {
    toastr: Toastr;
}
