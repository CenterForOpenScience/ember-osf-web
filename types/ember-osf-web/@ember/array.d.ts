import '@ember/array';

declare module '@ember/array' {
    export function makeArray<T>(obj: T | T[]): T[];
}
