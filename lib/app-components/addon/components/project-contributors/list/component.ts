import Store from '@ember-data/store';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { dropTask, enqueueTask, task, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import Analytics from 'ember-osf-web/services/analytics';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import { HighlightableContributor } from './item/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class List extends Component {
    // Required parameters
    node!: Node;

    // Optional parameters
    bindReload?: (action: () => void) => void;

    // Private properties
    @service analytics!: Analytics;
    @service intl!: Intl;
    @service store!: Store;
    @service toast!: Toast;

    contributors: Contributor[] = [];
    hasMore = false;
    page = 1;

    popperOptions = {
        modifiers: {
            preventOverflow: {
                escapeWithReference: false,
            },
        },
    };

    /**
     * If the current user is an admin
     */
    @computed('node.currentUserPermissions')
    get isAdmin(): boolean {
        return this.node.currentUserPermissions.includes(Permission.Admin);
    }

    /**
     * Number of contributors with bibliographic
     */
    @computed('contributors.@each.bibliographic')
    get bibliographicCount(): number {
        return this.contributors.reduce((acc, { bibliographic }) => acc + +bibliographic, 0);
    }

    /**
     * Number of registered admins
     */
    @computed('contributors.@each.{unregisteredContributor,permission}')
    get adminCount(): number {
        return this.contributors.reduce(
            (acc, { permission: p, unregisteredContributor: u }) => acc + +(p === Permission.Admin && !u),
            0,
        );
    }

    /**
     * Changes the contributor's bibliographic
     */
    @enqueueTask
    @waitFor
    async toggleBibliographic(contributor: HighlightableContributor) {
        const actionName = `${contributor.toggleProperty('bibliographic') ? '' : 'de'}select`;
        this.analytics.track('checkbox', actionName, 'Collections - Submit - Update Bibliographic');

        await taskFor(this.saveAndHighlight).perform(contributor);
    }

    /**
     * Changes the order of contributors for ember-sortable
     */
    @dropTask
    @waitFor
    async reorderContributors(
        contributors: HighlightableContributor[],
        contributor: HighlightableContributor,
    ) {
        const newIndex = contributors.indexOf(contributor);
        this.contributors.removeObject(contributor);
        this.contributors.insertAt(newIndex, contributor);

        contributor.setProperties({
            index: newIndex,
        });

        await taskFor(this.saveAndHighlight).perform(contributor);
    }

    /**
     * Saves the contributor and highlights the row with success/failure
     */
    @task
    @waitFor
    async saveAndHighlight(contributor: HighlightableContributor) {
        let highlightClass: typeof contributor.highlightClass;

        try {
            await contributor.save();
            highlightClass = 'success';
        } catch (e) {
            highlightClass = 'failure';
        }

        contributor.setProperties({ highlightClass });
        await timeout(2000);
        contributor.setProperties({ highlightClass: '' });
    }

    /**
     * Removes a contributor
     */
    @task
    @waitFor
    async removeContributor(contributor: Contributor) {
        this.analytics.track('button', 'click', 'Collections - Submit - Remove Contributor');

        try {
            await contributor.destroyRecord();
            this._doReload();
            this.toast.success(this.intl.t('app_components.project_contributors.list.remove_contributor_success'));
        } catch (e) {
            const errorMessage = this.intl.t('app_components.project_contributors.list.remove_contributor_error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }

        // It's necessary to unload the record from the store after destroying it, in case the user is added back as a
        // contributor again
        this.store.unloadRecord(contributor);
    }

    @task
    @waitFor
    async loadContributors() {
        const contributors = await this.node.queryHasMany(
            'contributors',
            { page: this.page },
        );
        this.set('contributors', this.contributors.concat(contributors));
        this.set('hasMore', this.contributors && this.contributors.length < contributors.meta.total);
    }

    /**
     * Changes the contributor's permissions
     */
    @enqueueTask
    @waitFor
    async updatePermissions(contributor: HighlightableContributor, permission: Permission) {
        this.analytics.track('option', 'select', 'Collections - Submit - Change Permission');
        contributor.setProperties({ permission });

        await taskFor(this.saveAndHighlight).perform(contributor);
    }

    init() {
        super.init();
        taskFor(this.loadContributors).perform();
    }

    didReceiveAttrs() {
        if (this.bindReload) {
            this.bindReload(this._doReload.bind(this));
        }
    }

    @action
    loadMoreContributors() {
        this.page++;
        taskFor(this.loadContributors).perform();
    }

    @action
    _doReload() {
        this.page = 1;
        this.set('contributors', []);
        taskFor(this.loadContributors).perform();
    }
}
