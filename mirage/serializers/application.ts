import { underscore } from '@ember/string';
import { JSONAPISerializer, ModelInstance, Request } from 'ember-cli-mirage';
import { ModelRegistry, RelationshipsFor } from 'ember-data';
import { RelatedLinkMeta, RelationshipLinks } from 'osf-api';

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
        model: T,
        relationship: RelationshipsFor<T>,
    ): RelatedLinkMeta {
        let relatedCounts: string[] = [];
        if (this.request.queryParams.related_counts) {
            relatedCounts = this.request.queryParams.related_counts.split(',');
        }
        const related = model[relationship];
        const count = Array.isArray(related) ? related.length : 0;
        return relatedCounts.includes(this.keyForRelationship(relationship)) ? { count } : {};
    }

    serialize(_: ModelInstance, __: Request) {
        // eslint-disable-next-line prefer-rest-params
        const json = JSONAPISerializer.prototype.serialize.apply(this, arguments);
        if ('data' in json) {
            if ('attributes' in json.data && 'normal_links' in json.data.attributes) {
                const links = json.data.attributes.normal_links;
                json.data.links = links;
                delete json.data.attributes.normal_links;
            }
            if ('relationships' in json.data) {
                const { relationships } = json.data;
                for (const key of Object.keys(relationships)) {
                    const relationship = relationships[key].links;
                    if ('data' in relationship) {
                        json.data.relationships[key].data = relationship.data;
                        delete json.data.relationships[key].links.data;
                    }
                }
            }
        }
        return json;
    }
}
