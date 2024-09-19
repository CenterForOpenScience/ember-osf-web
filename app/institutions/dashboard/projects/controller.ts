import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import { ResourceTypeFilterValue } from 'osf-components/components/search-page/component';
import { ObjectListColumn } from '../-components/object-list/component';

export default class InstitutionDashboardProjects extends Controller {
    @service intl!: Intl;

    columns: ObjectListColumn[] = [
        { // Title
            name: this.intl.t('institutions.dashboard.object_list.table_headers.title'),
            getValue: searchResult => searchResult.displayTitle,
        },
        { // Link
            name: this.intl.t('institutions.dashboard.object_list.table_headers.link'),
            type: 'link',
            getHref: searchResult => searchResult.indexCard.get('osfUrl'),
            getLinkText: searchResult => searchResult.indexCard.get('guidFromIdentifierList'),
        },
        { // Object type
            name: this.intl.t('institutions.dashboard.object_list.table_headers.object_type'),
            getValue: searchResult => searchResult.intlResourceType,
        },
        { // Date created
            name: this.intl.t('institutions.dashboard.object_list.table_headers.created_date'),
            getValue : searchResult => searchResult.dateFields[0].date,
        },
        { // Date modified
            name: this.intl.t('institutions.dashboard.object_list.table_headers.modified_date'),
            getValue : searchResult => searchResult.dateFields[1].date, // this feels quite brittle...
        },
        { // DOI
            name: this.intl.t('institutions.dashboard.object_list.table_headers.doi'),
            type: 'doi',
        },
        { // Storage location
            name: this.intl.t('institutions.dashboard.object_list.table_headers.storage_location'),
            // TODO: Update when OsfMap representation is available
            getValue: searchResult => searchResult.storageLocation,
        },
        { // Total data stored
            name: this.intl.t('institutions.dashboard.object_list.table_headers.total_data_stored'),
            // TODO: Update when OsfMap representation is available
            getValue: searchResult => searchResult.totalDataStored,
        },
        { // Contributor name + permissions
            name: this.intl.t('institutions.dashboard.object_list.table_headers.contributor_name'),
            type: 'contributors',
        },
        { // View count
            name: this.intl.t('institutions.dashboard.object_list.table_headers.view_count'),
            // TODO: Update when OsfMap representation is available
            getValue: searchResult => searchResult.viewCount,
        },
        { // Download count
            name: this.intl.t('institutions.dashboard.object_list.table_headers.download_count'),
            // TODO: Update when OsfMap representation is available
            getValue: searchResult => searchResult.downloadCount,
        },
        { // Has metadata
            name: this.intl.t('institutions.dashboard.object_list.table_headers.has_metadata'),
            // TODO: Update when OsfMap representation is available
            getValue: searchResult => searchResult.hasMetadata,
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
