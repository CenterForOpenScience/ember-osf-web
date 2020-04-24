import Service from '@ember/service';

export default class Intl extends Service {
    readonly formats: unknown;

    locale: string[];

    readonly locales: string[];

    /* tslint:disable:variable-name */
    private _locale: string[];

    private _adapter: unknown;

    private _timer: unknown;
    /* tslint:enable:variable-name */

    formatRelative(date: Date, options: {}): string;

    formatMessage(message: string, options: {}): string;

    formatNumber(num: number, options: {}): string;

    formatTime(date: Date, options: {}): string;

    formatDate(date: Date, options: {}): string;

    lookup(key: string, localeName?: string, options?: object): string;

    t(key: string, options?: object): string;

    exists(key: string, localeName?: string): boolean;

    setLocale(locale: string): void;

    addLocaleData(data: object): void;

    addTranslations(localeName: string, payload: object): unknown;

    translationsFor(localeName: string): unknown;

    getFormat(formatType: string, format: string): unknown;

    localeWithDefault(localeName?: string): string[];

    private updateDocumentLanguage(locales: string[]): void;
}
