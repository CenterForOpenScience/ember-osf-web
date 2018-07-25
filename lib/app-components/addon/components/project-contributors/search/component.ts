import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { DS } from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Node from 'ember-osf-web/models/node';
import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import Toast from 'ember-toastr/services/toast';
import styles from './styles';
import layout from './template';

const nameFields = [
    'full_name',
    'given_name',
    'middle_names',
    'family_name',
].join();

export default class Search extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;
    @service i18n!: I18N;
    @service store!: DS.Store;
    @service toast!: Toast;

    query: string = '';
    page: number = 1;
    showUnregisteredForm: boolean = false;
    node: Node = this.node;

    @alias('search.lastSuccessful.value') results?: DS.AdapterPopulatedRecordArray<User>;
    @alias('results.meta.total_pages') totalPages?: number;

    search = task(function *(this: Search) {
        yield timeout(250);
        this.analytics.track('list', 'filter', 'Collections - Contributors - Search');

        const results = yield this.store.query('user', {
            filter: {
                [nameFields]: this.query,
            },
            page: this.page,
        });

        return results;
    }).restartable();

    addContributor = task(function *(this: Search, user: User) {
        this.analytics.track('list', 'filter', 'Collections - Contributors - Add Contributor');

        const contributor = this.store.createRecord('contributor', {
            permission: 'write',
            bibliographic: true,
            sendEmail: 'false',
            nodeId: this.node.id,
            userId: user.id,
        });

        try {
            yield contributor.save();
            this.toast.success(this.i18n.t('app_components.project_contributors.search.add_contributor_success'));
        } catch (e) {
            this.toast.error(this.i18n.t('app_components.project_contributors.search.add_contributor_error'));
            throw e;
        }
    });

    @action
    findUsers(this: Search) {
        if (!this.query) {
            return;
        }

        this.get('search').perform();
    }
}
