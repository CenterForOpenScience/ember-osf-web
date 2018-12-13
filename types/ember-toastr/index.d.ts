declare module 'ember-toastr/services/toast' {
    import Service from '@ember/service';

    interface ToastOptions {
        closeButton: boolean;
        debug: boolean;
        newestOnTop: boolean;
        progressBar: boolean;
        positionClass: string;
        preventDuplicates: boolean;
        showDuration: number;
        hideDuration: number;
        timeOut: number;
        extendedTimeOut: number;
        showEasing: string;
        hideEasing: string;
        showMethod: string;
        hideMethod: string;
        tapToDismiss: boolean;
    }

    export default class Toast extends Service {
        error(message: string, title?: string, options?: Partial<ToastOptions>): void;
        info(message: string, title?: string, options?: Partial<ToastOptions>): void;
        success(message: string, title?: string, options?: Partial<ToastOptions>): void;
        warning(message: string, title?: string, options?: Partial<ToastOptions>): void;
    }
}
