import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';

import RelatedPropertyPathModel from './related-property-path';
import SearchResultModel from './search-result';

export interface SearchFilter {
    propertyPath: string;
    filterValue: string[];
    filterType?: string;
}

export default class IndexCardSearchModel extends Model {
    @attr('string') cardSearchText!: string;
    @attr('array') cardSearchFilters!: SearchFilter[];
    @attr('number') totalResultCount!: number;

    @hasMany('search-result', { inverse: null })
    searchResultPage!: AsyncHasMany<SearchResultModel> & SearchResultModel[];

    @hasMany('related-property-path', { inverse: null })
    relatedProperties!: RelatedPropertyPathModel[];

    get firstPageCursor() {
        if (this.searchResultPage.links.first?.href) {
            const firstPageLinkUrl = new URL(this.searchResultPage.links.first?.href);
            return firstPageLinkUrl.searchParams.get('page[cursor]');
        }
        return null;
    }

    get prevPageCursor() {
        if (this.searchResultPage.links.prev?.href) {
            const prevPageLinkUrl = new URL(this.searchResultPage.links.prev?.href);
            return prevPageLinkUrl.searchParams.get('page[cursor]');
        }
        return null;
    }

    get nextPageCursor() {
        if (this.searchResultPage.links.next?.href) {
            const nextPageLinkUrl = new URL(this.searchResultPage.links.next?.href);
            return nextPageLinkUrl.searchParams.get('page[cursor]');
        }
        return null;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'index-card-search': IndexCardSearchModel;
    } // eslint-disable-line semi
}
