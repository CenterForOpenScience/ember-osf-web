import DS, { ModelRegistry, TransformRegistry } from 'ember-data';

export function attr<K extends keyof TransformRegistry>(
    type?: K,
    options?: DS.AttrOptions<TransformRegistry[K]>,
): PropertyDecorator;

export function hasMany<K extends keyof ModelRegistry>(
    type: K,
    options?: DS.RelationshipOptions<ModelRegistry[K]>,
): PropertyDecorator;

export function belongsTo<K extends keyof ModelRegistry>(
    type: K,
    options?: DS.RelationshipOptions<ModelRegistry[K]>,
): PropertyDecorator;
