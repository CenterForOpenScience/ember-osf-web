import { SafeString } from 'handlebars';

declare module 'ember-i18n/test-support' {
    export function t(translation: string, interpolations?: Record<string, unknown>): SafeString;
}
