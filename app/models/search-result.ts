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
        if (this.resourceType === 'user') {
            return this.indexCard.get('resourceMetadata')['name'][0]['@value'];
        } else if (this.resourceType === 'file') {
            return this.indexCard.get('resourceMetadata')['fileName'][0]['@value'];
        }
        return this.indexCard.get('resourceMetadata')['title'][0]['@value'];
    }

    get absoluteUrl() {
        return this.indexCard.get('resourceMetadata')['@id'];
    }

    // returns list of contributors for osf objects
    // returns list of affiliated institutions for osf users
    get affiliatedEntities() {
        if (this.resourceType === 'user') {
            // return something
        } else {
            return this.indexCard.get('resourceMetadata').creator.map( (item:any) => item.name[0]['@value']);
        }
    }

    get dateFields() {
        if (this.resourceType === 'user') {
            return [];
        }
        return [
            { label: 'Date created', date: this.indexCard.get('resourceMetadata').created },
            { label: 'Last edited', date: this.indexCard.get('resourceMetadata').modified },
        ]
    }

    get resourceType() {
        const types = this.indexCard.get('resourceMetadata').resourceType.map( (item: any) => item['@id']);
        if (types.includes('Project')) {
            return 'project';
        } else if (types.includes('Registration')) {
            return 'registration';
        } else if (types.includes('Preprint')) {
            return 'preprint';
        } else if (types.includes('ProjectComponent')) {
            return 'project_component';
        } else if (types.includes('RegistrationComponent')) {
            return 'registration_component';
        } else if (types.includes('Person')) {
            return 'user';
        } else if(types.includes('File')) {
            return 'file';
        }
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'search-result': SearchResultModel;
    } // eslint-disable-line semi
}
