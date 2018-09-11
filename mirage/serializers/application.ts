import { underscore } from '@ember/string';
import { JSONAPISerializer } from 'ember-cli-mirage';
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
}
