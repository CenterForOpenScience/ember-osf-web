import Store from '@ember-data/store';
// import EmberArray, { A } from '@ember/array';
import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
// import { waitFor } from '@ember/test-waiters';
// import { restartableTask, task, timeout } from 'ember-concurrency';
// import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
// import QueryParams from 'ember-parachute';
// import { is, OrderedSet } from 'immutable';
import Media from 'ember-responsive';

// import config from 'ember-get-config';
// import ProviderModel from 'ember-osf-web/models/provider';
// import Analytics from 'ember-osf-web/services/analytics';
// import discoverStyles from 'registries/components/registries-discover-search/styles';
// import { SearchFilter, SearchOptions, SearchOrder, SearchResults } from 'registries/services/search';
// import ShareSearch, {
//     ShareRegistration,
//     ShareTermsAggregation,
//     ShareTermsFilter,
// } from 'registries/services/share-search';
import { tracked } from '@glimmer/tracking';

// Helper for Immutable.is as it doesn't like Native Arrays
// function isEqual(obj1: any, obj2: any) {
//     if (Array.isArray(obj1) && Array.isArray(obj2)) {
//         if (obj1.length !== obj2.length) {
//             return false;
//         }

//         for (let i = 0; i < obj1.length; i++) {
//             if (!(isEqual(obj1[i], obj2[i]))) {
//                 return false;
//             }
//         }

//         return true;
//     }

//     return is(obj1, obj2);
// }

// interface DiscoverQueryParams {
//     page: number;
//     query: string;
//     size: number;
//     sort: SearchOrder;
//     registrationTypes: ShareTermsFilter[];
//     sourceNames: string[];
//     subjects: ShareTermsFilter[];
// }

// const sortOptions = [
//     new SearchOrder({
//         ascending: true,
//         display: 'registries.discover.order.relevance',
//         key: undefined,
//     }),
//     new SearchOrder({
//         ascending: true,
//         display: 'registries.discover.order.modified_ascending',
//         key: 'date',
//     }),
//     new SearchOrder({
//         ascending: false,
//         display: 'registries.discover.order.modified_descending',
//         key: 'date',
//     }),
// ];

// const queryParams = {
//     sourceNames: {
//         as: 'provider',
//         defaultValue: [] as string[],
//         serialize(value: string[]) {
//             return value.join('|');
//         },
//         deserialize(value: string) {
//             return value.split('|');
//         },
//     },
//     registrationTypes: {
//         as: 'type',
//         refresh: true,
//         defaultValue: [] as ShareTermsFilter[],
//         serialize(value: ShareTermsFilter[]) {
//             return value.map(filter => filter.value).join('|');
//         },
//         deserialize(value: string) {
//             // Handle empty strings
//             if (value.trim().length < 1) {
//                 return [];
//             }
//             return value.split('|').map(
//                 registrationType => new ShareTermsFilter('registration_type', registrationType, registrationType),
//             );
//         },
//     },
//     query: {
//         as: 'q',
//         defaultValue: '',
//         replace: true,
//     },
//     size: {
//         defaultValue: 10,
//         serialize(value: number) {
//             return value.toString();
//         },
//         deserialize(value: string) {
//             return parseInt(value, 10) || this.defaultValue;
//         },
//     },
//     sort: {
//         defaultValue: sortOptions[0],
//         serialize(value: SearchOrder) {
//             if (value.key === 'date_modified') {
//                 return '';
//             }

//             return `${value.ascending ? '' : '-'}${value.key || ''}`;
//         },
//         deserialize(value: string) {
//             return sortOptions.find(
//                 option => !!option.key
//                     && value.endsWith(option.key)
//                     && option.ascending === !value.startsWith('-'),
//             ) || sortOptions[0];
//         },
//     },
//     page: {
//         defaultValue: 1,
//         serialize(value: number) {
//             return value.toString();
//         },
//         deserialize(value: string) {
//             return parseInt(value, 10) || this.defaultValue;
//         },
//     },
//     subjects: {
//         defaultValue: [] as ShareTermsFilter[],
//         serialize(value: ShareTermsFilter[]) {
//             return value.map(filter => filter.value).join(',,');
//         },
//         deserialize(value: string) {
//             return value.split(',,').map(
//                 subjectTerm => {
//                     const subjectPieces = subjectTerm.split('|');
//                     const display = subjectPieces[subjectPieces.length - 1];
//                     return new ShareTermsFilter('subjects', subjectTerm, display);
//                 },
//             );
//         },
//     },
// };

// export const discoverQueryParams = new QueryParams<DiscoverQueryParams>(queryParams);

export default class Discover extends Controller.extend() {
    @service media!: Media;
    @service intl!: Intl;
    @service store!: Store;
    @service shareSearch!: ShareSearch;

    @tracked q?: string = '';
    @tracked sort?: string =  '-relevance';

    get showSidePanelToggle() {
        return this.media.isMobile || this.media.isTablet;
    }

    queryParams = ['q', 'page', 'sort'];

    @action
    onSearch() {
        return;
    }
}
