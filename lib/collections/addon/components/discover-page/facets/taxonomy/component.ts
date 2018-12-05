import { service } from '@ember-decorators/service';
import { setProperties } from '@ember/object';
import { task } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Provider from 'ember-osf-web/models/provider';
import Taxonomy from 'ember-osf-web/models/taxonomy';
import Theme from 'ember-osf-web/services/theme';
import Base from '../base/component';
import styles from './styles';
import template from './template';

const pageSize = 150;

export interface TaxonomyItem {
    id: string;
    text: string;
    children: TaxonomyItem[];
    childCount: number;
    shareTitle: string;
    path: string;
}

function getParentPaths(item: string): string[] {
    const [prefix, ...subjectNames] = item.split('|').slice(0, -1);

    return subjectNames
        .reduce((acc, val) => acc.concat(`${acc.lastObject}|${val}`), [prefix])
        .slice(1);
}

export const getTaxonomies = task(function *(item: TaxonomyItem, provider: Provider) {
    const results: QueryHasManyResult<Taxonomy> = yield provider.queryHasMany('taxonomies', {
        filter: { parents: item.id },
        page: { size: pageSize },
    });

    setProperties(item, {
        children: results
            .map(({ id, text, childCount, shareTitle, path }) => ({
                id,
                text,
                children: [],
                childCount,
                shareTitle,
                path: path.replace(/^\w+/, ''),
            }))
            .sortBy('text'),
    });
});

@layout(template, styles)
export default class SearchFacetTaxonomy extends Base.extend({
    getTaxonomies,

    didInsertElement(this: SearchFacetTaxonomy, ...args: any[]) {
        this._super(...args);

        const { context, filterChanged } = this;

        setProperties(context, {
            didInit: true,
            expandedList: (context.activeFilter as string[])
                .map(getParentPaths)
                .reduce((acc, val) => acc.concat(val), [])
                .uniq(),
            updateFilters(item?: string) {
                const { activeFilter, defaultQueryFilters, expandedList } = context;

                if (item) {
                    const inFilter = activeFilter.includes(item);

                    const method = inFilter ? 'removeObject' : 'pushObject';
                    activeFilter[method](item);

                    if (!inFilter) {
                        const parents = getParentPaths(item).filter(path => !expandedList.includes(path));
                        expandedList.pushObjects(parents);
                    }
                }

                setProperties(context, {
                    queryParam: activeFilter.join('OR'),
                    currentQueryFilters: !activeFilter.length ?
                        defaultQueryFilters :
                        {
                            subjects: activeFilter.map(path => path.replace(/^.*\|/, '')),
                        },
                });

                filterChanged();
            },
        });

        context.updateFilters();

        setProperties(this, {
            item: {
                id: 'null',
                text: '',
                children: [],
                childCount: 0,
                shareTitle: '',
                path: '',
            },
        });

        this.get('getTaxonomies').perform(this.item, this.theme.provider!);
    },
}) {
    @service theme!: Theme;

    item: TaxonomyItem = this.item;
    context!: Base['context'] & { expandedList: string[]; };
}
