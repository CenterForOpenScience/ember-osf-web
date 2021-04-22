import Store from '@ember-data/store';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { dropTask, restartableTask } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import RouterService from '@ember/routing/router-service';
import { layout } from 'ember-osf-web/decorators/component';
import Contributor, { ModelWithBibliographicContributors } from 'ember-osf-web/models/contributor';
import CurrentUser from 'ember-osf-web/services/current-user';
import Ready from 'ember-osf-web/services/ready';
import captureException from 'ember-osf-web/utils/capture-exception';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('span')
export default class ContributorList extends Component {
    // Required arguments
    model!: ModelWithBibliographicContributors & { isAnonymous?: boolean };

    // Optional arguments
    shouldTruncate = true;
    shouldLinkUsers = false;
    shouldEnableClaimUser = false;
    allowRemoveMe = false;

    // Private properties
    @service store!: Store;
    @service ready!: Ready;
    @service toast!: Toast;
    @service intl!: Intl;
    @service currentUser!: CurrentUser;
    @service router!: RouterService;

    page = 1;
    displayedContributors: Contributor[] = [];
    totalContributors = 0;
    shouldLoadAll = navigator.userAgent.includes('Prerender');

    @alias('loadContributors.isRunning')
    isLoading!: boolean;

    @restartableTask({ on: 'didReceiveAttrs' })
    @waitFor
    async loadContributors(more?: boolean) {
        if (!this.model || this.model.isAnonymous) {
            return;
        }

        const blocker = this.ready.getBlocker();
        if (this.shouldLoadAll && !this.shouldTruncate) {
            const allContributors = await this.model.loadAll('bibliographicContributors');
            this.setProperties({
                displayedContributors: allContributors.toArray(),
                totalContributors: allContributors.length,
            });
        } else if (more) {
            const nextPage = await this.model.queryHasMany(
                'bibliographicContributors',
                { page: this.incrementProperty('page') },
            );
            this.displayedContributors.pushObjects(nextPage);
            this.set('totalContributors', nextPage.meta.total);
        } else {
            this.set('page', 1);
            const firstPage = await this.model.bibliographicContributors;
            this.setProperties({
                displayedContributors: firstPage.toArray(),
                totalContributors: firstPage.meta.total,
            });
        }

        blocker.done();
    }

    @dropTask
    @waitFor
    async removeMeTask() {
        if (!this.model || this.model.isAnonymous || !this.currentUser.currentUserId) {
            return;
        }

        const userID = this.currentUser.currentUserId;
        let contributor = this.displayedContributors
            .find(contrib => contrib.users.get('id') === this.currentUser.currentUserId);

        if (!contributor) {
            contributor = await this.store.findRecord('contributor', `${this.model.id}-${userID}`);
            this.setProperties({
                displayedContributors: [...this.displayedContributors, contributor],
            });
        }

        try {
            await contributor!.destroyRecord();
            this.toast.success(this.intl.t('contributor_list.remove_contributor.success'));
            this.router.transitionTo('home');
        } catch (e) {
            const { supportEmail } = config.support;
            const errorMessage = this.intl
                .t('contributor_list.remove_contributor.error', { supportEmail, htmlSafe: true })
                .toString();
            captureException(e, { errorMessage });
            this.toast.error(errorMessage);
        }
    }

    @action
    removeMe() {
        taskFor(this.removeMeTask).perform();
    }

    @computed('allowRemoveMe', 'currentUser.currentUserId', 'totalContributors')
    get shouldShowRemoveMeButton() {
        return this.allowRemoveMe && this.currentUser.currentUserId && this.totalContributors > 1;
    }

    @computed('shouldTruncate', 'truncated')
    get truncateCount() {
        return this.shouldTruncate ? 3 : undefined;
    }
}
