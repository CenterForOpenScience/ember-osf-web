declare module 'keen-tracking' {
    export default class KeenTracking {
        static helpers: {
            getUniqueId(): string;
            getDatetimeIndex(date?: Date): {
                hour_of_day: number, // eslint-disable-line camelcase
                day_of_week: number, // eslint-disable-line camelcase
                day_of_month: number, // eslint-disable-line camelcase
                month: number,
                year: number,
            };
            getBrowserProfile(): any;
        };

        constructor(params: { projectId: string, writeKey: string });

        recordEvent(collection: string, data: any): Promise<any>;

        extendEvents(extend: object | (() => any));
        extendEvents(collection: string, extend: object | (() => any)); // eslint-disable-line no-dupe-class-members
    }
}
