import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { getSingleOsfmapValue } from 'ember-osf-web/packages/osfmap/jsonld';

import humanFileSize from 'ember-osf-web/utils/human-file-size';
import { ObjectListColumn } from '../-components/object-list/component';

export default class InstitutionDashboardRegistrations extends Controller {
    @service intl!: Intl;

    missingItemPlaceholder = this.intl.t('institutions.dashboard.object-list.table-items.missing-info');
    columns: ObjectListColumn[] = [
        { // Title
            name: this.intl.t('institutions.dashboard.object-list.table-headers.title'),
            type: 'link',
            getHref: searchResult => searchResult.indexCard.get('osfIdentifier'),
            getLinkText: searchResult => searchResult.displayTitle,
            propertyPathKey: 'title',
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
            isSortable: true,
            propertyPathKey: 'dateCreated',
        },
        { // Date modified
            name: this.intl.t('institutions.dashboard.object-list.table-headers.modified_date'),
            getValue: searchResult => getSingleOsfmapValue(searchResult.resourceMetadata, ['dateModified']),
            isSortable: true,
            propertyPathKey: 'dateModified',
        },
        { // DOI
            name: this.intl.t('institutions.dashboard.object-list.table-headers.doi'),
            type: 'doi',
            propertyPathKey: 'sameAs',
        },
        { // Storage location
            name: this.intl.t('institutions.dashboard.object-list.table-headers.storage_location'),
            getValue: searchResult => searchResult.storageRegion,
            propertyPathKey: 'storageRegion.prefLabel',
        },
        { // Total data stored
            name: this.intl.t('institutions.dashboard.object-list.table-headers.total_data_stored'),
            getValue: searchResult => {
                const byteCount = getSingleOsfmapValue(searchResult.resourceMetadata, ['storageByteCount']);
                return byteCount ? humanFileSize(byteCount) : this.missingItemPlaceholder;
            },
            isSortable: true,
            sortParam: 'integer-value',
            propertyPathKey: 'storageByteCount',
        },
        { // Contributor name + permissions
            name: this.intl.t('institutions.dashboard.object-list.table-headers.contributor_name'),
            type: 'contributors',
            propertyPathKey: 'creator.name',
        },
        { // View count
            name: this.intl.t('institutions.dashboard.object-list.table-headers.view_count'),
            getValue: searchResult => {
                const metrics = searchResult.usageMetrics;
                return metrics ? metrics.viewCount : this.missingItemPlaceholder;
            },
            isSortable: true,
            sortParam: 'integer-value',
            propertyPathKey: 'usage.viewCount',
        },
        { // Resource type
            name: this.intl.t('institutions.dashboard.object-list.table-headers.resource_nature'),
            getValue: searchResult => searchResult.resourceNature || this.missingItemPlaceholder,
            propertyPathKey: 'resourceNature.displayLabel',
        },
        { // License
            name: this.intl.t('institutions.dashboard.object-list.table-headers.license'),
            getValue: searchResult => searchResult.license?.name || this.missingItemPlaceholder,
            propertyPathKey: 'rights.name',
        },
        { // Funder name
            name: this.intl.t('institutions.dashboard.object-list.table-headers.funder_name'),
            getValue: searchResult => {
                if (!searchResult.funders) {
                    return this.missingItemPlaceholder;
                }
                return searchResult.funders.map((funder: { name: string }) => funder.name).join(', ');
            },
            propertyPathKey: 'funder.name',
        },
        { // schema
            name: this.intl.t('institutions.dashboard.object-list.table-headers.registration_schema'),
            getValue: searchResult => searchResult.registrationTemplate,
            propertyPathKey: 'conformsTo.title',
        },
    ];

    get defaultQueryOptions() {
        const identifiers = this.model.institution.iris.join(',');
        return {
            cardSearchFilter: {
                affiliation: [identifiers],
                resourceType: 'Registration',
            },
        };
    }
}
