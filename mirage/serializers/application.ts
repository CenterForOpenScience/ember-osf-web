import { underscore } from '@ember/string';
import { JSONAPISerializer, Model, ModelInstance, Request } from 'ember-cli-mirage';
import { ModelRegistry, RelationshipsFor } from 'ember-data';
import config from 'ember-get-config';
import { RelatedLinkMeta, RelationshipLinks } from 'osf-api';

const { OSF: { apiUrl } } = config;

// eslint-disable-next-line space-infix-ops
export type SerializedLinks<T extends ModelRegistry[keyof ModelRegistry]> = {
    [relName in Exclude<RelationshipsFor<T>, 'toString'>]?: RelationshipLinks;
};

export default class ApplicationSerializer extends JSONAPISerializer {
    keyForAttribute(attr: string) {
        return underscore(attr);
    }

    keyForRelationship(relationship: string) {
        return underscore(relationship);
    }

    buildRelatedLinkMeta<T extends ModelRegistry[keyof ModelRegistry]>(
        model: ModelInstance<T>,
        relationship: RelationshipsFor<T>,
    ): RelatedLinkMeta {
        let relatedCounts: string[] = [];
        if (this.request.queryParams.related_counts) {
            relatedCounts = this.request.queryParams.related_counts.split(',');
        }
        const related = (model as Model<T>)[relationship];
        const count = Array.isArray(related.models) ? related.models.length : 0;
        return relatedCounts.includes(this.keyForRelationship(relationship)) ? { count } : {};
    }

    buildNormalLinks(model: ModelInstance) {
        return {
            self: `${apiUrl}/v2/${this.typeKeyForModel(model)}/${model.id}/`,
        };
    }

    serialize(model: ModelInstance, request: Request) {
        const json = super.serialize(model, request);
        json.data.links = this.buildNormalLinks(model);
        if ('relationships' in json.data && json.data.relationships !== undefined) {
            const { relationships } = json.data;
            for (const key of Object.keys(relationships)) {
                const relationship = relationships[key].links;
                if ('data' in relationship) {
                    json.data.relationships[key].data = relationship.data;
                    delete json.data.relationships[key].links.data;
                }
            }
        }

        return json;
    }
}
