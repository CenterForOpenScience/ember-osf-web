import { dasherize } from '@ember/string';
import { JSONAPISerializer, ModelInstance, Request } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';

export default class AddonServiceSerializer extends JSONAPISerializer {
    keyForAttribute(attr: string) {
        return dasherize(attr);
    }

    keyForRelationship(key: string) {
        return dasherize(key);
    }

    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${addonServiceAPIUrl}${model.modelName}/${model.id}/`,
        };
    }
    serialize(model: ModelInstance, request: Request) {
        const json = super.serialize(model, request);
        json.data.links = this.buildNormalLinks(model);
        json.meta = {
            ...(json.meta || {}),
        };
        json.data.relationships = Object
            .entries(this.buildRelationships(model))
            .reduce((acc, [key, value]) => {
                acc[dasherize(key)] = value;
                return acc;
            }, {} as Record<string, unknown>); // better type?

        return json;
    }
}
