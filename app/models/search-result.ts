import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import IntlService from 'ember-intl/services/intl';
import { getOsfmapValues, getSingleOsfmapObject, getSingleOsfmapValue } from 'ember-osf-web/packages/osfmap/jsonld';
import { languageFromLanguageCode } from 'osf-components/components/file-metadata-manager/component';

import IndexCardModel from './index-card';

export interface IriMatchEvidence {
    matchingIri: string;
    osfmapPropertyPath: string[];
    propertyPathKey: string;
}

export interface TextMatchEvidence {
    matchingHighlight: string;
    osfmapPropertyPath: string[];
    propertyPathKey: string;
}

export const CardLabelTranslationKeys = {
    project: 'osf-components.search-result-card.project',
    project_component: 'osf-components.search-result-card.project_component',
    registration: 'osf-components.search-result-card.registration',
    registration_component: 'osf-components.search-result-card.registration_component',
    preprint: 'osf-components.search-result-card.preprint',
    file: 'osf-components.search-result-card.file',
    user: 'osf-components.search-result-card.user',
    unknown: 'osf-components.search-result-card.unknown',
};

export default class SearchResultModel extends Model {
    @service intl!: IntlService;

    @attr('array') matchEvidence!: Array<IriMatchEvidence | TextMatchEvidence>;
    @attr('number') cardSearchResultCount!: number;

    @belongsTo('index-card', { inverse: null })
    indexCard!: IndexCardModel;

    get resourceMetadata() {
        return this.indexCard.get('resourceMetadata');
    }

    // TODO: double check how matchEvidence works
    get context() {
        if (this.matchEvidence) {
            const matchEvidenceString = this.matchEvidence.reduce(
                (acc, current) => acc.concat(
                    `${current.propertyPathKey}: ${
                        ('matchingHighlight' in current)
                            ? current.matchingHighlight
                            : current.matchingIri
                    }`,
                ),
                '',
            );
            return htmlSafe(matchEvidenceString);
        }
        return null;
    }

    get displayTitle() {
        if (this.resourceType === 'user') {
            return getSingleOsfmapValue(this.resourceMetadata, ['name']);
        } else if (this.resourceType === 'file') {
            return getSingleOsfmapValue(this.resourceMetadata, ['fileName']);
        }
        return getSingleOsfmapValue(this.resourceMetadata, ['title']);
    }

    get fileTitle() {
        if (this.resourceType === 'file') {
            return getSingleOsfmapValue(this.resourceMetadata, ['title']);
        }
        return null;
    }

    get description() {
        return getSingleOsfmapValue(this.resourceMetadata, ['description']);
    }

    get absoluteUrl() {
        return this.resourceMetadata['@id'];
    }

    // returns list of affilated institutions for users
    // returns list of contributors for osf objects
    get affiliatedEntities() {
        if (this.resourceType === 'user') {
            if (this.resourceMetadata.affiliation) {
                return this.resourceMetadata.affiliation.map((item: any) => ({
                    name: getSingleOsfmapValue(item, ['name']),
                    absoluteUrl: item['@id'],
                }));
            }
        } else if (this.resourceMetadata.creator) {
            return this.getSortedContributors(this.resourceMetadata);
        } else if (this.isContainedBy?.[0]?.creator) {
            return this.getSortedContributors(this.isContainedBy?.[0]);
        }
    }

    private getSortedContributors(base) {
        const objectOrder = Object.fromEntries(
            base.qualifiedAttribution?.map((item: any) => [
                getSingleOsfmapValue(item, ['agent']),
                Number.parseInt(
                    getSingleOsfmapValue(item, ['osf:order']),
                    10,
                ),
            ]) || [],
        );
        return base.creator?.map((item: any) => ({
            name: getSingleOsfmapValue(item, ['name']),
            absoluteUrl: item['@id'],
            index: objectOrder[item['@id']],
        })).sortBy('index');
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
                    date: getSingleOsfmapValue(this.resourceMetadata, ['dateCreated']),
                },
                {
                    label: this.intl.t('osf-components.search-result-card.date_modified'),
                    date: getSingleOsfmapValue(this.resourceMetadata, ['dateModified']),
                },
            ];
        default:
            return [
                {
                    label: this.intl.t('osf-components.search-result-card.date_created'),
                    date: getSingleOsfmapValue(this.resourceMetadata, ['dateCreated']),
                },
                {
                    label: this.intl.t('osf-components.search-result-card.date_modified'),
                    date: getSingleOsfmapValue(this.resourceMetadata, ['dateModified']),
                },
            ];
        }
    }

    get isPartOf() {
        return this.resourceMetadata.isPartOf;
    }

    get isContainedBy() {
        return this.resourceMetadata.isContainedBy;
    }

    get isPartOfTitleAndUrl() {
        if (this.isPartOf) {
            return {
                title: this.isPartOf[0]?.title?.[0]?.['@value'],
                absoluteUrl: this.isPartOf[0]?.['@id'],
            };
        }
        return null;
    }

    get isContainedByTitleAndUrl() {
        if (this.isContainedBy) {
            return {
                title: this.isContainedBy[0]?.title?.[0]?.['@value'],
                absoluteUrl: this.isContainedBy[0]?.['@id'],
            };
        }
        return null;
    }

    get isPartOfCollection() {
        const isPartOfCollection = this.resourceMetadata.isPartOfCollection;
        if (isPartOfCollection) {
            return {
                title: getSingleOsfmapValue(this.resourceMetadata, ['isPartOfCollection', 'title']),
                absoluteUrl: getSingleOsfmapValue(this.resourceMetadata, ['isPartOfCollection']),
            };
        }
        return null;
    }

    get languageFromCode() {
        if (this.resourceMetadata.language) {
            const language = getSingleOsfmapValue(this.resourceMetadata, ['language']);
            return languageFromLanguageCode(language);
        }
        return null;
    }

    get funders() {
        if (this.resourceMetadata.funder) {
            return this.resourceMetadata.funder.map( (item: any) => ({
                name: getSingleOsfmapValue(item, ['name']),
                identifier: getSingleOsfmapValue(item, ['identifier']),
            }));
        }
        return null;
    }

    get nodeFunders() {
        if (this.resourceMetadata.isContainedBy?.[0]?.funder) {
            return this.resourceMetadata.isContainedBy[0].funder.map( (item: any) => ({
                name: getSingleOsfmapValue(item, ['name']),
                identifier: getSingleOsfmapValue(item, ['identifier']),
            }));
        }
        return null;
    }

    get provider() {
        if (this.resourceMetadata.publisher) {
            return {
                name: getSingleOsfmapValue(this.resourceMetadata, ['publisher', 'name']),
                identifier: getSingleOsfmapValue(this.resourceMetadata, ['publisher']),
            };
        }
        return null;
    }

    get doi() {
        return this.indexCard.get('resourceIdentifier').filter(id => id.includes('https://doi.org'));
    }

    get license() {
        if (this.resourceMetadata.rights) {
            return {
                name: getSingleOsfmapValue(this.resourceMetadata, ['rights', 'name']),
                identifier: getSingleOsfmapValue(this.resourceMetadata, ['rights']),
            };
        }
        return null;
    }

    get nodeLicense() {
        if (this.resourceMetadata.isContainedBy?.[0]?.rights) {
            return {
                name: getSingleOsfmapValue(this.resourceMetadata, ['isContainedBy', 'rights', 'name']),
                identifier: getSingleOsfmapValue(this.resourceMetadata, ['rights']) ||
                    getSingleOsfmapValue(this.resourceMetadata, ['isContainedBy', 'rights']),
            };
        }
        return null;
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
        } else if (types.includes('File')) {
            return 'file';
        }
        return 'unknown';
    }

    get intlResourceType() {
        return this.intl.t(CardLabelTranslationKeys[this.resourceType]);
    }

    get orcids() {
        if (this.resourceMetadata.identifier) {
            const orcids = this.resourceMetadata.identifier.filter(
                (item: any) => new URL(item['@value']).host === 'orcid.org',
            );
            return orcids.map( (item: any) => item['@value']);
        }
        return null;
    }

    get resourceNature() {
        return getSingleOsfmapValue(this.resourceMetadata, ['resourceNature','displayLabel']);
    }

    get hasDataResource() {
        return this.resourceMetadata.hasDataResource;
    }

    get hasAnalyticCodeResource() {
        return this.resourceMetadata.hasAnalyticCodeResource;
    }

    get hasMaterialsResource() {
        return this.resourceMetadata.hasMaterialsResource;
    }

    get hasPapersResource() {
        return this.resourceMetadata.hasPapersResource;
    }

    get hasSupplementalResource() {
        return this.resourceMetadata.hasSupplementalResource;
    }

    get registrationTemplate() {
        return getSingleOsfmapValue(this.resourceMetadata, ['conformsTo', 'title']);
    }

    get isWithdrawn() {
        return this.resourceMetadata.dateWithdrawn || this.resourceMetadata['osf:withdrawal'];
    }

    get configuredAddonNames() {
        return getOsfmapValues(this.resourceMetadata, ['hasOsfAddon', 'prefLabel']);
    }

    get storageRegion() {
        return getSingleOsfmapValue(this.resourceMetadata, ['storageRegion', 'prefLabel']);
    }

    get usageMetrics() {
        const usage = getSingleOsfmapObject(this.resourceMetadata, ['usage']);
        if (!usage) {
            return null;
        }
        return {
            period: getSingleOsfmapValue(usage, ['temporalCoverage']),
            viewCount: getSingleOsfmapValue(usage, ['viewCount']),
            downloadCount: getSingleOsfmapValue(usage, ['downloadCount']),
        };
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'search-result': SearchResultModel;
    } // eslint-disable-line semi
}
