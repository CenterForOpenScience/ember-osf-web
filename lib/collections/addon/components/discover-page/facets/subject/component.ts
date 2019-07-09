import { service } from '@ember-decorators/service';
import { setProperties } from '@ember/object';
import { task } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Provider from 'ember-osf-web/models/provider';
import Subject from 'ember-osf-web/models/subject';
import Theme from 'ember-osf-web/services/theme';
import Base from '../base/component';
import styles from './styles';
import template from './template';

const pageSize = 150;

export interface SubjectItem {
    id: string;
    text: string;
    children: SubjectItem[];
    childrenCount: number;
    shareTitle: string;
}

// function getParentPaths(item: string): string[] {
//     const [prefix, ...subjectNames] = item.split('|').slice(0, -1);
//
//     return subjectNames
//         .reduce((acc, val) => acc.concat(`${acc.lastObject}|${val}`), [prefix])
//         .slice(1);
//  }

export const getSubjects = task(function *(item: SubjectItem, provider: Provider) {
    const results: QueryHasManyResult<Subject> = yield provider.queryHasMany('subjects', {
        filter: { parent: item.id },
        page: { size: pageSize },
        related_counts: 'children',
    });

    setProperties(item, {
        children: results
            .map(({ id, text, childrenCount, taxonomyName: shareTitle }) => ({
                id,
                text,
                children: [],
                childrenCount,
                shareTitle,
            }))
            .sortBy('text'),
    });
});

@layout(template, styles)
export default class SearchFacetSubject extends Base.extend({
    getSubjects,

    didInsertElement(this: SearchFacetSubject, ...args: any[]) {
        this._super(...args);

        const { context, filterChanged } = this;

        setProperties(context, {
            didInit: true,
            expandedList: [] as string[],
            // expandedList: (context.activeFilter as string[])
            //     .map(getParentPaths)
            //     .reduce((acc, val) => acc.concat(val), [])
            //     .uniq(),
            updateFilters(item?: string) {
                // const { activeFilter, defaultQueryFilters, expandedList } = context;
                const { activeFilter, defaultQueryFilters } = context;

                if (item) {
                    const inFilter = activeFilter.includes(item);

                    const method = inFilter ? 'removeObject' : 'pushObject';
                    activeFilter[method](item);
                    // TODO: Auto expand parents of current subjects active filters.
                    // if (!inFilter) {
                    //     const parents = getParentPaths(item).filter(path => !expandedList.includes(path));
                    //     expandedList.pushObject(parents);
                    // }
                }

                setProperties(context, {
                    queryParam: activeFilter.join('OR'),
                    currentQueryFilters: !activeFilter.length ?
                        defaultQueryFilters :
                        {
                            subjects: activeFilter,
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
                childrenCount: 0,
                shareTitle: '',
            },
        });

        this.get('getSubjects').perform(this.item, this.theme.provider!);
    },
}) {
    @service theme!: Theme;

    item: SubjectItem = this.item;
    context!: Base['context'] & { expandedList: string[]; };
}
