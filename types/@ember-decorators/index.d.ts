declare module '@ember-decorators/data' {
    import { ModelRegistry } from 'ember-data';

    export function attr(transform?: string, conf?: object): PropertyDecorator;

    export function hasMany<K extends keyof ModelRegistry>(
        type: K,
        conf?: object,
    ): PropertyDecorator;

    export function belongsTo<K extends keyof ModelRegistry>(
        type?: K,
        conf?: object,
    ): PropertyDecorator;
}
