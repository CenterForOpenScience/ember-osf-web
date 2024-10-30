import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import { ResourceTypeFilterValue } from 'osf-components/components/search-page/component';
import { ObjectListColumn } from '../-components/object-list/component';

export default class InstitutionDashboardPreprints extends Controller {
    @service intl!: Intl;

    columns: ObjectListColumn[] = [
        { // Title
            name: this.intl.t('institutions.dashboard.object-list.table-headers.title'),
            getValue: searchResult => searchResult.displayTitle,
        },
        { // Link
            name: this.intl.t('institutions.dashboard.object-list.table-headers.link'),
            type: 'link',
            getHref: searchResult => searchResult.indexCard.get('osfIdentifier'),
            getLinkText: searchResult => searchResult.indexCard.get('osfGuid'),
        },
        { // Date created
            name: this.intl.t('institutions.dashboard.object-list.table-headers.created_date'),
            getValue: searchResult => searchResult.getResourceMetadataField('dateCreated'),
            sortKey: 'dateCreated',
        },
        { // Date modified
            name: this.intl.t('institutions.dashboard.object-list.table-headers.modified_date'),
            getValue: searchResult => searchResult.getResourceMetadataField('dateModified'),
            sortKey: 'dateModified',
        },
        { // DOI
            name: this.intl.t('institutions.dashboard.object-list.table-headers.doi'),
            type: 'doi',
        },
        { // License
            name: this.intl.t('institutions.dashboard.object-list.table-headers.license'),
            getValue: searchResult => searchResult.license?.name,
        },
        { // Contributor name + permissions
            name: this.intl.t('institutions.dashboard.object-list.table-headers.contributor_name'),
            type: 'contributors',
        },
        { // View count
            name: this.intl.t('institutions.dashboard.object-list.table-headers.view_count'),
            getValue: searchResult => searchResult.usageMetrics.viewCount,
        },
        { // Download count
            name: this.intl.t('institutions.dashboard.object-list.table-headers.view_count'),
            getValue: searchResult => searchResult.usageMetrics.downloadCount,
        },
    ];

    get defaultQueryOptions() {
        const identifiers = this.model.institution.iris.join(',');
        return {
            cardSearchFilter: {
                affiliation: identifiers,
                resourceType: ResourceTypeFilterValue.Preprints,
            },
        };
    }
}
