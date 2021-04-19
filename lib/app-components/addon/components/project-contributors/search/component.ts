import Store from '@ember-data/store';
import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, task, timeout } from 'ember-concurrency';
import { DS } from 'ember-data';
import Intl from 'ember-intl/services/intl';

import { layout } from 'ember-osf-web/decorators/component';
import Node from 'ember-osf-web/models/node';
import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import Toast from 'ember-toastr/services/toast';
import styles from './styles';
import template from './template';

const nameFields = [
    'full_name',
    'given_name',
    'middle_names',
    'family_name',
].join();

@layout(template, styles)
export default class Search extends Component {
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service store!: Store;
    @service toast!: Toast;

    node!: Node;
    query: string = '';
    page: number = 1;
    showUnregisteredForm: boolean = false;
    onAddContributor?: () => void;

    @alias('search.lastSuccessful.value') results?: DS.AdapterPopulatedRecordArray<User>;
    @alias('results.meta.total_pages') totalPages?: number;

    @task
    @waitFor
    async addContributor(user: User) {
        this.analytics.track('list', 'filter', 'Collections - Contributors - Add Contributor');

        const contributor = this.store.createRecord('contributor', {
            permission: 'write',
            bibliographic: true,
            node: this.node,
            users: user,
        });

        try {
            await contributor.save();
            if (this.onAddContributor) {
                this.onAddContributor();
            }
            this.toast.success(this.intl.t('app_components.project_contributors.search.add_contributor_success'));
        } catch (e) {
            const errorMessage = this.intl.t('app_components.project_contributors.search.add_contributor_error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }
    }

    @restartableTask
    @waitFor
    async search(page?: number) {
        if (!this.query) {
            return undefined;
        }

        if (page) {
            this.setProperties({ page });
        }

        await timeout(250);
        this.analytics.track('list', 'filter', 'Collections - Contributors - Search');

        const results = await this.store.query('user', {
            filter: {
                [nameFields]: this.query,
            },
            page: this.page,
        });

        return results;
    }
}
