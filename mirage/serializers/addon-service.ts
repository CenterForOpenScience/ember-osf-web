import { underscore } from '@ember/string';
import { JSONAPISerializer, ModelInstance, Request } from 'ember-cli-mirage';

import Model from '@ember-data/model';
import { RelationshipsFor } from 'ember-data';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import { Relationship } from 'osf-api';
import { RelationshipObject } from 'jsonapi-typescript';

export type SerializedRelationships<T extends Model> = {
    [relName in Exclude<RelationshipsFor<T>, 'toString'>]?: Relationship;
};

export default class AddonServiceSerializer<T extends Model> extends JSONAPISerializer {
    keyForAttribute(attr: string) {
        return underscore(attr);
    }

    keyForRelationship(relationship: string) {
        return underscore(relationship);
    }

    // override in model-specific serializers
    buildRelationships(_: ModelInstance<T>): SerializedRelationships<T> {
        return {};
    }

    buildNormalLinks(model: ModelInstance<T>) {
        return {
            self: `${addonServiceAPIUrl}${this.typeKeyForModel(model)}/${model.id}/`,
        };
    }
    serialize(model: any, request: Request) {
        const json = super.serialize(model, request);
        const _datas: any[] = Array.isArray(json.data) ? json.data : [json.data];
        const _models: Arry<ModelInstance<T>> = Array.isArray(model.models) ? model.models : [model];
        for (let i = 0; i < _models.length; i++) {
            const _model = _models[i];
            const _datum = _datas[i];
            _datum.links = this.buildNormalLinks(_model);
            _datum.relationships = Object
                .entries(this.buildRelationships(_model))
                .reduce((acc, [key, value]) => {
                    acc[underscore(key)] = value as RelationshipObject;
                    return acc;
                }, {} as Record<string, RelationshipObject>);
        }
        return json;
    }
}
