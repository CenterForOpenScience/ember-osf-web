import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import IntlService from 'ember-intl/services/intl';

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
    @service intl!: IntlService;

    @attr('array') matchEvidence!: Array<IriMatchEvidence | TextMatchEvidence>;
    @attr('number') recordResultCount!: number;

    @belongsTo('index-card', { inverse: null })
    indexCard!: IndexCardModel;

    get resourceMetadata() {
        return this.indexCard.get('resourceMetadata');
    }

    // TODO: double check how matchEvidence works
    get context() {
        if (this.matchEvidence) {
            return this.matchEvidence.reduce(
                (acc, current) => acc.concat(
                    `${current.propertyPath}:
                    ${current['@type'] === 'TextMatchEvidence' ? current.matchingHighlight : current.matchingIri}`,
                ),
                '',
            );
        }
        return null;
    }

    get displayTitle() {
        if (this.resourceType === 'user') {
            return this.resourceMetadata['name'][0]['@value'];
        } else if (this.resourceType === 'file') {
            return this.resourceMetadata['fileName'][0]['@value'];
        }
        return this.resourceMetadata['title'][0]['@value'];
    }

    get absoluteUrl() {
        return this.resourceMetadata['@id'];
    }

    // returns list of contributors for osf objects
    // returns list of affiliated institutions for osf users
    get affiliatedEntities() {
        if (this.resourceType === 'user') {
            // return something
        } else {
            return this.resourceMetadata.creator.map( (item:any) => item.name[0]['@value']);
        }
    }

    get dateFields() {
        switch (this.resourceType) {
        case 'user':
            return [];
        case 'registration':
        case 'registration_component':
            return [
                {
                    label: this.intl.t('osf-components.search-result-card.date_registered'),
                    date: this.resourceMetadata.dateCreated[0]['@value'],
                },
                {
                    label: this.intl.t('osf-components.search-result-card.date_modified'),
                    date: this.resourceMetadata.dateModified[0]['@value'],
                },
            ];
        default:
            return [
                {
                    label: this.intl.t('osf-components.search-result-card.date_created'),
                    date: this.resourceMetadata.dateCreated[0]['@value'],
                },
                {
                    label: this.intl.t('osf-components.search-result-card.date_modified'),
                    date: this.resourceMetadata.dateModified[0]['@value'],
                },
            ];
        }
    }

    get isPartOf() {
        const isPartOf = this.resourceMetadata.isPartOf;
        if (isPartOf) {
            return {
                label: this.intl.t('osf-components.search-result-card.from'),
                title: this.resourceMetadata.isPartOf[0].title[0]['@value'],
                absoluteUrl: this.resourceMetadata.isPartOf[0]['@id'],
            };
        }
        return null;
    }

    get funders() {
        if (this.resourceMetadata.funder) {
            return this.resourceMetadata.funder.map( (item: any) => ({
                name: item.name[0]['@value'],
                identifier: item.identifier[0]['@value'],
            }));
        }
        return null;
    }

    get provider() {
        if (this.resourceMetadata.publisher) {
            return {
                name: this.resourceMetadata.publisher[0].name[0]['@value'],
                identifier: this.resourceMetadata.publisher[0]['@id'],
            };
        }
        return null;
    }

    get doi() {
        return this.indexCard.get('resourceIdentifier').filter(id => id.includes('https://doi.org'));
    }

    get license() {
        return {
            name: this.resourceMetadata.rights[0].name[0]['@value'],
            identifier: this.resourceMetadata.rights[0]['@id'],
        };
    }

    get resourceType() {
        const types = this.resourceMetadata.resourceType.map( (item: any) => item['@id']);
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
        return 'unknown';
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'search-result': SearchResultModel;
    } // eslint-disable-line semi
}
