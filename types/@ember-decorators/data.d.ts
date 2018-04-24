declare module '@ember-decorators/data' {
    interface AttrOptions<T> {
        allowNull?: boolean;
        defaultValue?: T;
    }

    export function attr<K extends keyof TransformRegistry>(type?: K, options?: AttrOptions): PropertyDecorator;

    interface HasManyOptions {
        allowBulkUpdate?: true;
        allowBulkRemove?: true;
        async?: boolean;
        defaultValue?: any;
        inverse?: keyof ModelRegistry | null;
        serializerType?: keyof SerializerRegistry;
    }

    export function hasMany<K extends keyof ModelRegistry>(type: K, options?: HasManyOptions): PropertyDecorator;

    interface BelongsToOptions {
        inverse: keyof ModelRegistry | null;
    }

    export function belongsTo<K extends keyof ModelRegistry>(type: K, options?: BelongsToOptions): PropertyDecorator;
}
