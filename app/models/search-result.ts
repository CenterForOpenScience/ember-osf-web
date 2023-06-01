import Model, { attr, belongsTo } from '@ember-data/model';

import IndexCardModel from './index-card';

export interface IriMatchEvidence {
    '@type': 'IriMatchEvidence';
    matchingIri: string;
    propertyPath: string[];
}

export interface TextMatchEvidence {
    '@type': 'TextMatchEvidence';
    matchingHighlight: string;
    propertyPath: string[];
}

export default class SearchResultModel extends Model {
    @attr('array') matchEvidence!: Array<IriMatchEvidence | TextMatchEvidence>;
    @attr('number') recordResultCount!: number;

    @belongsTo('index-card', { inverse: null })
    indexCard!: IndexCardModel;

    // TODO: double check how matchEvidence works
    get context() {
        return this.matchEvidence.reduce(
            (acc, current) => acc.concat(
                `${current.propertyPath}:
                ${current['@type'] === 'TextMatchEvidence' ? current.matchingHighlight : current.matchingIri}`,
            ),
            '',
        );
    }

    get displayTitle() {
        if (this.indexCard.resourceType.includes('foaf:person')) {
            return this.indexCard.resourceMetadata['foaf:name'];
        } else if (this.indexCard.resourceType.includes('osf:File')) {
            return this.indexCard.resourceMetadata['osf:fileName'];
        }
        return this.indexCard.resourceMetadata['dcterms:title'];
    }

    // returns list of contributors for osf objects
    // returns list of affiliated institutions for osf users
    get affiliatedEntities() {
        if (this.indexCard.resourceType.includes('foaf:person')) {
            // return something
        } else {
            // return something else
        }
    }

    get dateFields() {
        if (this.indexCard.resourceType.includes('foaf:person')) {
            return [];
        } else if (this.indexCard.resourceType) {
            return [];
        }
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'search-result': SearchResultModel;
    } // eslint-disable-line semi
}
