import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, timeout } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';
import SubjectModel from 'ember-osf-web/models/subject';
import { SubjectManager } from 'osf-components/components/subjects/manager/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class SearchSubjects extends Component {
    // required
    subjectsManager!: SubjectManager;

    // private
    userQuery?: string;

    @alias('doSearch.isRunning')
    isLoading!: boolean;

    searchResults?: SubjectModel[];

    @computed('searchResults.[]')
    get resultCount() {
        const { searchResults } = this;
        return typeof searchResults === 'undefined' ? 10 : searchResults.length;
    }

    @restartableTask
    @waitFor
    async doSearch() {
        await timeout(500); // debounce

        const { userQuery } = this;
        if (!userQuery) {
            return undefined;
        }

        if (this.subjectsManager.model.get('isProject')) {
            const model = this.subjectsManager.model;
            const filterResults = await model.queryHasMany('subjectsAcceptable', {
                filter: {
                    text: userQuery,
                },
                page: {
                    size: 150,
                },
                sort: 'text',
                related_counts: 'children',
            });

            this.set('searchResults', filterResults);
            return filterResults;
        } else {
            const provider = await this.subjectsManager.provider;
            const filterResults = await provider.queryHasMany('subjects', {
                filter: {
                    text: userQuery,
                },
                page: {
                    size: 150,
                },
                sort: 'text',
                related_counts: 'children',
                embed: 'parent',
            });

            this.set('searchResults', filterResults);
            return filterResults;
        }
    }
}
