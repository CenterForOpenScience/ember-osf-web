declare module 'ember-toastr/services/toast' {
    import Service from '@ember/service';
    import { ToastOptions } from '@types/toastr';

    export default class Toast extends Service {
        error(message: string, title?: string, options?: Partial<ToastOptions>): void;
        info(message: string, title?: string, options?: Partial<ToastOptions>): void;
        success(message: string, title?: string, options?: Partial<ToastOptions>): void;
        warning(message: string, title?: string, options?: Partial<ToastOptions>): void;
    }
}

interface Window {
    toastr: Toastr;
}
