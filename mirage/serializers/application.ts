import { underscore } from '@ember/string';
import { Collection, JSONAPISerializer, ModelInstance, Request } from 'ember-cli-mirage';
import { RelationshipsFor } from 'ember-data';
import config from 'ember-get-config';
import { RelatedLinkMeta, Relationship } from 'osf-api';

const { OSF: { apiUrl } } = config;

// eslint-disable-next-line space-infix-ops
export type SerializedRelationships<T> = {
    [relName in Exclude<RelationshipsFor<T>, 'toString'>]?: Relationship;
};

export default class ApplicationSerializer<T> extends JSONAPISerializer {
    keyForAttribute(attr: string) {
        return underscore(attr);
    }

    keyForRelationship(relationship: string) {
        return underscore(relationship);
    }

    buildRelatedLinkMeta(
        model: ModelInstance<T>,
        relationship: RelationshipsFor<T>,
    ): RelatedLinkMeta {
        let relatedCounts: string[] = [];
        if (this.request.queryParams.related_counts) {
            relatedCounts = this.request.queryParams.related_counts.split(',');
        }
        // We have to cast the relationship to a Collection here because only hasManys will have .models
        const related = model[relationship] as unknown as Collection<T>;
        const count = Array.isArray(related.models) ? related.models.length : 0;
        return relatedCounts.includes(this.keyForRelationship(relationship)) ? { count } : {};
    }

    buildNormalLinks(model: ModelInstance<T>) {
        return {
            self: `${apiUrl}/v2/${this.typeKeyForModel(model)}/${model.id}/`,
        };
    }

    buildRelationships(_: ModelInstance<T>): SerializedRelationships<T> {
        return {};
    }

    serialize(model: ModelInstance<T>, request: Request) {
        const json = super.serialize(model, request);
        json.data.links = this.buildNormalLinks(model);
        json.data.relationships = Object
            .entries(this.buildRelationships(model))
            .reduce((acc, [key, value]) => {
                acc[underscore(key)] = value;
                return acc;
            }, {} as Record<string, Relationship>);

        return json;
    }
}
