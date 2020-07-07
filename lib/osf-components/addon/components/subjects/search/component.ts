import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';

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

    @alias('doSearch.lastSuccessful.value')
    searchResults?: SubjectModel[];

    @computed('searchResults.[]')
    get resultCount() {
        const { searchResults } = this;
        return typeof searchResults === 'undefined' ? 10 : searchResults.length;
    }

    @task({ withTestWaiter: true, restartable: true })
    doSearch = task(function *(this: SearchSubjects) {
        yield timeout(500); // debounce

        const provider = yield this.subjectsManager.provider;

        const { userQuery } = this;
        if (!userQuery) {
            return undefined;
        }
        return yield provider.queryHasMany('subjects', {
            filter: {
                text: userQuery,
            },
            page: {
                size: 150,
            },
            related_counts: 'children',
            embed: 'parent',
        });
    });
}
