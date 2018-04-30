import { ModelRegistry, TransformRegistry } from 'ember-data';

interface AttrOptions<T> {
    allowNull?: boolean;
    defaultValue?: T;
}

export function attr<K extends keyof TransformRegistry>(
    type?: K,
    options?: AttrOptions<TransformRegistry[K]>,
): PropertyDecorator;

interface RelationshipOptions<Model> {
    async?: boolean;
    inverse?: keyof Model | null;
    polymorphic?: boolean;
}

export function hasMany<K extends keyof ModelRegistry>(
    type: K,
    options?: RelationshipOptions<ModelRegistry[K]>,
): PropertyDecorator;

export function belongsTo<K extends keyof ModelRegistry>(
    type: K,
    options?: RelationshipOptions<ModelRegistry[K]>,
): PropertyDecorator;
