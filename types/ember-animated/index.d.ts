declare module 'ember-animated' {
    export function parallel<Args extends unknown[]>(
        ...funcs: Array<(...args: Args) => void>
    ): (...args: Args) => Promise<unknown>;
}
