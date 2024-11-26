import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { getSingleOsfmapValue } from 'ember-osf-web/packages/osfmap/jsonld';

import { ResourceTypeFilterValue } from 'osf-components/components/search-page/component';
import { ObjectListColumn } from '../-components/object-list/component';

export default class InstitutionDashboardPreprints extends Controller {
    @service intl!: Intl;

    missingItemPlaceholder = this.intl.t('institutions.dashboard.object-list.table-items.missing-info');

    columns: ObjectListColumn[] = [
        { // Title
            name: this.intl.t('institutions.dashboard.object-list.table-headers.title'),
            type: 'link',
            getHref: searchResult => searchResult.indexCard.get('osfIdentifier'),
            getLinkText: searchResult => searchResult.displayTitle,
        },
        { // Link
            name: this.intl.t('institutions.dashboard.object-list.table-headers.link'),
            type: 'link',
            getHref: searchResult => searchResult.indexCard.get('osfIdentifier'),
            getLinkText: searchResult => searchResult.indexCard.get('osfGuid'),
        },
        { // Date created
            name: this.intl.t('institutions.dashboard.object-list.table-headers.created_date'),
            getValue: searchResult => getSingleOsfmapValue(searchResult.resourceMetadata, ['dateCreated']),
            sortKey: 'dateCreated',
        },
        { // Date modified
            name: this.intl.t('institutions.dashboard.object-list.table-headers.modified_date'),
            getValue: searchResult => getSingleOsfmapValue(searchResult.resourceMetadata, ['dateModified']),
            sortKey: 'dateModified',
        },
        { // DOI
            name: this.intl.t('institutions.dashboard.object-list.table-headers.doi'),
            type: 'doi',
        },
        { // License
            name: this.intl.t('institutions.dashboard.object-list.table-headers.license'),
            getValue: searchResult => searchResult.license?.name || this.missingItemPlaceholder,
        },
        { // Contributor name + permissions
            name: this.intl.t('institutions.dashboard.object-list.table-headers.contributor_name'),
            type: 'contributors',
        },
        { // View count
            name: this.intl.t('institutions.dashboard.object-list.table-headers.view_count'),
            getValue: searchResult => {
                const metrics = searchResult.usageMetrics;
                return metrics ? metrics.viewCount : this.missingItemPlaceholder;
            },
            sortKey: 'usage.viewCount',
            sortParam: 'integer-value',
        },
        { // Download count
            name: this.intl.t('institutions.dashboard.object-list.table-headers.download_count'),
            getValue: searchResult => {
                const metrics = searchResult.usageMetrics;
                return metrics ? metrics.downloadCount : this.missingItemPlaceholder;
            },
            sortKey: 'usage.downloadCount',
            sortParam: 'integer-value',
        },
    ];

    get defaultQueryOptions() {
        const identifiers = this.model.institution.iris.join(',');
        return {
            cardSearchFilter: {
                affiliation: [identifiers],
                resourceType: ResourceTypeFilterValue.Preprints,
            },
        };
    }
}