import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';


import humanFileSize from 'ember-osf-web/utils/human-file-size';
import { ResourceTypeFilterValue } from 'osf-components/components/search-page/component';
import { ObjectListColumn } from '../-components/object-list/component';

export default class InstitutionDashboardProjects extends Controller {
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
        { // Storage location
            name: this.intl.t('institutions.dashboard.object-list.table-headers.storage_location'),
            getValue: searchResult => searchResult.storageRegion,
        },
        { // Total data stored
            name: this.intl.t('institutions.dashboard.object-list.table-headers.total_data_stored'),
            getValue: searchResult => humanFileSize(searchResult.getResourceMetadataField('storageByteCount')),
        },
        { // Contributor name + permissions
            name: this.intl.t('institutions.dashboard.object-list.table-headers.contributor_name'),
            type: 'contributors',
        },
        { // View count
            name: this.intl.t('institutions.dashboard.object-list.table-headers.view_count'),
            getValue: searchResult => searchResult.usageMetrics.viewCount,
        },
        { // Resource type
            name: this.intl.t('institutions.dashboard.object-list.table-headers.resource_nature'),
            getValue: searchResult => searchResult.resourceNature,
        },
        { // License
            name: this.intl.t('institutions.dashboard.object-list.table-headers.license'),
            getValue: searchResult => searchResult.license?.name,
        },
        { // addons associated
            name: this.intl.t('institutions.dashboard.object-list.table-headers.addons'),
            getValue: searchResult => searchResult.configuredAddonNames,
        },
        { // Funder name
            name: this.intl.t('institutions.dashboard.object-list.table-headers.funder_name'),
            getValue: searchResult => searchResult.funders.map((funder: {name: string}) => funder.name).join(', '),
        },
    ];

    get defaultQueryOptions() {
        const identifiers = this.model.institution.iris.join(',');
        return {
            cardSearchFilter: {
                affiliation: identifiers,
                resourceType: ResourceTypeFilterValue.Projects,
            },
        };
    }
}
