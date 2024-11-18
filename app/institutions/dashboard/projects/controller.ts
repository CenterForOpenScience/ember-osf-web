import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { getSingleOsfmapValue } from 'ember-osf-web/packages/osfmap/jsonld';

import humanFileSize from 'ember-osf-web/utils/human-file-size';
import { ObjectListColumn } from '../-components/object-list/component';

export default class InstitutionDashboardProjects extends Controller {
    @service intl!: Intl;

    missingItemPlaceholder = this.intl.t('institutions.dashboard.object-list.table-items.missing-info');

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
        { // Storage location
            name: this.intl.t('institutions.dashboard.object-list.table-headers.storage_location'),
            getValue: searchResult => searchResult.storageRegion,
        },
        { // Total data stored
            name: this.intl.t('institutions.dashboard.object-list.table-headers.total_data_stored'),
            getValue: searchResult => {
                const byteCount = getSingleOsfmapValue(searchResult.resourceMetadata, ['storageByteCount']);
                return byteCount ? humanFileSize(byteCount) : this.missingItemPlaceholder;
            },
            sortKey: 'storageByteCount',
            sortParam: 'integer-value',
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
        { // Resource type
            name: this.intl.t('institutions.dashboard.object-list.table-headers.resource_nature'),
            getValue: searchResult => searchResult.resourceNature || this.missingItemPlaceholder,
        },
        { // License
            name: this.intl.t('institutions.dashboard.object-list.table-headers.license'),
            getValue: searchResult => searchResult.license?.name || this.missingItemPlaceholder,
        },
        { // addons associated
            name: this.intl.t('institutions.dashboard.object-list.table-headers.addons'),
            getValue: searchResult => searchResult.configuredAddonNames.length ?  searchResult.configuredAddonNames :
                this.missingItemPlaceholder,
        },
        { // Funder name
            name: this.intl.t('institutions.dashboard.object-list.table-headers.funder_name'),
            getValue: searchResult => {
                if (!searchResult.funders) {
                    return this.missingItemPlaceholder;
                }
                return searchResult.funders.map((funder: { name: string }) => funder.name).join(', ');
            },
        },
    ];

    get defaultQueryOptions() {
        const identifiers = this.model.institution.iris.join(',');
        return {
            cardSearchFilter: {
                affiliation: [identifiers],
                resourceType: 'Project',
            },
        };
    }
}
