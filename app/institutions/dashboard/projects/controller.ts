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
            valuePath: 'displayTitle',
        },
        { // Link
            name: this.intl.t('institutions.dashboard.object_list.table_headers.link'),
            type: 'link',
            hrefValuePath: 'indexCard.osfUrl',
            linkText: 'indexCard.guidFromIdentifierList',
        },
        { // Object type
            name: this.intl.t('institutions.dashboard.object_list.table_headers.object_type'),
            valuePath: 'intlResourceType',
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
            type: 'doi',
        },
        { // Storage location
            name: this.intl.t('institutions.dashboard.object_list.table_headers.storage_location'),
            valuePath: 'storageLocation', // TODO: Update when OsfMap representation is available
        },
        { // Total data stored
            name: this.intl.t('institutions.dashboard.object_list.table_headers.total_data_stored'),
            valuePath: 'totalDataStored', // TODO: Update when OsfMap representation is available
        },
        { // Contributor name + permissions
            name: this.intl.t('institutions.dashboard.object_list.table_headers.contributor_name'),
            type: 'contributors',
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
