import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { dropTask, task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import RouterService from '@ember/routing/router-service';
import { layout } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import CurrentUser from 'ember-osf-web/services/current-user';
import Ready from 'ember-osf-web/services/ready';
import captureException from 'ember-osf-web/utils/capture-exception';
import defaultTo from 'ember-osf-web/utils/default-to';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('span')
export default class ContributorList extends Component {
    // Required arguments
    node?: Node;

    // Optional arguments
    shouldTruncate: boolean = defaultTo(this.shouldTruncate, true);
    shouldLinkUsers: boolean = defaultTo(this.shouldLinkUsers, false);
    shouldEnableClaimUser: boolean = false;
    allowRemoveMe: boolean = false;

    // Private properties
    @service store!: DS.Store;
    @service ready!: Ready;
    @service toast!: Toast;
    @service intl!: Intl;
    @service currentUser!: CurrentUser;
    @service router!: RouterService;

    page = 1;
    displayedContributors: Contributor[] = [];
    totalContributors = 0;
    shouldLoadAll: boolean = navigator.userAgent.includes('Prerender');

    @alias('loadContributors.isRunning')
    isLoading!: boolean;

    @task({ withTestWaiter: true, restartable: true, on: 'didReceiveAttrs' })
    loadContributors = task(function *(this: ContributorList, more?: boolean) {
        if (!this.node || this.node.isAnonymous) {
            return;
        }

        const blocker = this.ready.getBlocker();
        if (this.shouldLoadAll && !this.shouldTruncate) {
            const allContributors = yield this.node.loadAll('bibliographicContributors');
            this.setProperties({
                displayedContributors: allContributors.toArray(),
                totalContributors: allContributors.length,
            });
        } else if (more) {
            const nextPage: QueryHasManyResult<Contributor> = yield this.node.queryHasMany(
                'bibliographicContributors',
                { page: this.incrementProperty('page') },
            );
            this.displayedContributors.pushObjects(nextPage);
            this.set('totalContributors', nextPage.meta.total);
        } else {
            this.set('page', 1);
            const firstPage = yield this.node.bibliographicContributors;
            this.setProperties({
                displayedContributors: firstPage.toArray(),
                totalContributors: firstPage.meta.total,
            });
        }

        blocker.done();
    });

    @dropTask({ withTestWaiter: true })
    removeMeTask = task(function *(this: ContributorList) {
        if (!this.node || this.node.isAnonymous || !this.currentUser.currentUserId) {
            return;
        }

        const userID = this.currentUser.currentUserId;
        let contributor = this.displayedContributors
            .find(contrib => contrib.users.get('id') === this.currentUser.currentUserId);

        if (!contributor) {
            contributor = yield this.store.findRecord('contributor', `${this.node.id}-${userID}`);
            this.setProperties({
                displayedContributors: [...this.displayedContributors, contributor],
            });
        }

        try {
            yield contributor!.destroyRecord();
            this.toast.success(this.intl.t('contributor_list.remove_contributor.success'));
            this.router.transitionTo('home');
        } catch (e) {
            const { supportEmail } = config.support;
            const errorMessage = this.intl
                .t('contributor_list.remove_contributor.error', { supportEmail, htmlSafe: true });
            captureException(e, { errorMessage });
            this.toast.error(errorMessage);
        }
    });

    @action
    removeMe() {
        this.removeMeTask.perform();
    }

    @computed('allowRemoveMe', 'currentUser.currentUserId', 'totalContributors')
    get shouldShowRemoveMeButton() {
        return this.allowRemoveMe && this.currentUser.currentUserId && this.totalContributors > 1;
    }

    @computed('truncated')
    get truncateCount() {
        return this.shouldTruncate ? 3 : undefined;
    }
}
