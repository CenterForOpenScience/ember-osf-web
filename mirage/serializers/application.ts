import { underscore } from '@ember/string';
// @ts-ignore
import { JSONAPISerializer } from 'ember-cli-mirage';
import { RelationshipsFor } from 'ember-data';
import { RelatedLinkMeta, RelationshipLinks } from 'osf-api';

import OsfModel from 'ember-osf-web/models/osf-model';

// eslint-disable-next-line space-infix-ops
export type SerializedLinks<T extends OsfModel> = {
    [relName in Exclude<RelationshipsFor<T>, 'toString'>]?: RelationshipLinks;
};

export default class ApplicationSerializer extends JSONAPISerializer {
    request!: any;

    keyForAttribute(attr: string) {
        return underscore(attr);
    }

    keyForRelationship(relationship: string) {
        return underscore(relationship);
    }

    buildRelatedLinkMeta<T extends OsfModel>(model: T, relationship: RelationshipsFor<T>): RelatedLinkMeta {
        let relatedCounts = [];
        if (this.request.queryParams.related_counts) {
            relatedCounts = this.request.queryParams.related_counts.split(',');
        }
        return relatedCounts.includes(this.keyForRelationship(relationship)) ?
            { count: model[relationship].length } : {};
    }
}
