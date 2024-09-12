import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import { ResourceTypeFilterValue } from 'osf-components/components/search-page/component';

export default class InstitutionDashboardProjects extends Controller {
    @service intl!: Intl;

    columns = [
        { // Title
            name: this.intl.t('institutions.dashboard.object_list.table_headers.title'),
            valuePath: 'displayTitle',
        },
        { // Link
            name: this.intl.t('institutions.dashboard.object_list.table_headers.link'),
            valuePath: 'absoluteUrl',
        },
        { // Object type
            name: this.intl.t('institutions.dashboard.object_list.table_headers.object_type'),
            valuePath: 'displayType',
        },
        { // Date created
            name: this.intl.t('institutions.dashboard.object_list.table_headers.created_date'),
            valuePath: 'dateFields.0.date', // this feels quite brittle...
        },
        { // Date modified
            name: this.intl.t('institutions.dashboard.object_list.table_headers.modified_date'),
            valuePath: 'dateFields.1.date', // this feels quite brittle...
        },
        { // DOI
            name: this.intl.t('institutions.dashboard.object_list.table_headers.doi'),
            valuePath: 'doi',
        },
        { // Storage location
            name: this.intl.t('institutions.dashboard.object_list.table_headers.storage_location'),
            valuePath: 'storageLocation', // TODO: Update when OsfMap representation is available
        },
        { // Total data stored
            name: this.intl.t('institutions.dashboard.object_list.table_headers.total_data_stored'),
            valuePath: 'totalDataStored', // TODO: Update when OsfMap representation is available
        },
        { // Contributor name
            name: this.intl.t('institutions.dashboard.object_list.table_headers.contributor_name'),
            valuePath: 'contributors', // TODO: type of contributors?
        },
        { // Contributor permissions
            name: this.intl.t('institutions.dashboard.object_list.table_headers.contributor_permissions'),
            valuePath: 'contributors', // TODO: Update when OsfMap representation is available
        },
        { // View count
            name: this.intl.t('institutions.dashboard.object_list.table_headers.view_count'),
            valuePath: 'viewCount', // TODO: Update when OsfMap representation is available
        },
        { // Download count
            name: this.intl.t('institutions.dashboard.object_list.table_headers.download_count'),
            valuePath: 'downloadCount', // TODO: Update when OsfMap representation is available
        },
        { // Has metadata
            name: this.intl.t('institutions.dashboard.object_list.table_headers.has_metadata'),
            valuePath: 'hasMetadata', // TODO: Update when OsfMap representation is available
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
