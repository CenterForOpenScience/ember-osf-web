import { underscore } from '@ember/string';
import { JSONAPISerializer, ModelInstance, Request } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';

export default class AddonServiceSerializer extends JSONAPISerializer {
    keyForAttribute(attr: string) {
        return underscore(attr);
    }

    keyForRelationship(relationship: string) {
        return underscore(relationship);
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
                acc[underscore(key)] = value;
                return acc;
            }, {} as Record<string, unknown>); // better type?

        return json;
    }
}
