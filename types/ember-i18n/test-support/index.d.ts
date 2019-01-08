declare module 'ember-i18n/test-support' {
    interface SafeString {
        toString(): string;
        toHTML(): string;
    }
    export function t(translation: string): SafeString;
}
