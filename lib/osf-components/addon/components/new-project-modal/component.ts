import Store from '@ember-data/store';
import { A } from '@ember/array';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { dropTask, restartableTask, task, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import Intl from 'ember-intl/services/intl';
import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Institution from 'ember-osf-web/models/institution';
import Node from 'ember-osf-web/models/node';
import Region from 'ember-osf-web/models/region';
import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import Toast from 'ember-toastr/services/toast';
import styles from './styles';
import template from './template';

const {
    featureFlagNames: {
        storageI18n,
    },
} = config;

@layout(template, styles)
export default class NewProjectModal extends Component {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service store!: Store;
    @service features!: Features;
    @service intl!: Intl;
    @service toast!: Toast;

    // Required arguments
    @requiredAction afterProjectCreated!: (newNode: Node) => void;

    // Optional arguments
    isPublic?: boolean;

    // Private fields
    nodeTitle?: string;
    description?: string;
    more: boolean = false;
    templateFrom?: Node;
    selectedRegion?: Region;
    institutions: Institution[] = [];
    regions: Region[] = [];

    @alias('currentUser.user') user!: User;

    @reads('institutions') selectedInstitutions!: Institution[];

    @computed()
    get storageI18nEnabled() {
        return this.features.isEnabled(storageI18n);
    }

    @task({ on: 'init' })
    @waitFor
    async initTask() {
        if (this.storageI18nEnabled) {
            // not yielding so it runs in parallel
            taskFor(this.getStorageRegionsTask).perform();
        }
        this.set('institutions', (await this.currentUser.user!.institutions));
    }

    @task
    @waitFor
    async getStorageRegionsTask() {
        const regions = await this.store.findAll('region');

        this.setProperties({
            regions: regions.toArray(),
            selectedRegion: this.currentUser.user!.defaultRegion,
        });
    }

    @task
    @waitFor
    async loadDefaultRegionTask() {
        const { user } = this.currentUser;
        if (!user) {
            return;
        }

        await user.belongsTo('defaultRegion').reload();
    }

    @restartableTask
    @waitFor
    async searchUserNodesTask(title: string) {
        await timeout(500);
        const userNodes = await this.user.queryHasMany('nodes', { filter: { title } });
        return userNodes;
    }

    @dropTask
    @waitFor
    async createNodeTask(
        title: string = '',
        description: string = '',
        institutions: Institution[],
        templateFrom?: Node,
        storageRegion?: Region,
        isPublic?: boolean,
    ) {
        if (!title) {
            return;
        }
        const node = this.store.createRecord('node', {
            category: 'project',
            description,
            public: isPublic !== undefined ? isPublic : false,
            title,
        });

        if (templateFrom) {
            node.set('templateFrom', templateFrom.id);
        }
        if (institutions.length) {
            node.set('affiliatedInstitutions', institutions.slice());
        }
        if (storageRegion) {
            node.set('region', storageRegion);
        }

        try {
            await node.save();
        } catch (e) {
            const errorMessage = this.intl.t('new_project.could_not_create_project');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }

        this.afterProjectCreated(node);
    }

    @action
    selectInstitution(institution: Institution) {
        const selected = this.set('selectedInstitutions', this.selectedInstitutions.slice());

        if (selected.includes(institution)) {
            selected.removeObject(institution);
        } else {
            selected.pushObject(institution);
        }
    }

    @action
    selectAllInstitutions() {
        this.set('selectedInstitutions', this.institutions.slice());
    }

    @action
    removeAllInstitutions() {
        this.set('selectedInstitutions', A([]));
    }

    @action
    selectTemplateFrom(templateFrom: Node) {
        this.set('templateFrom', templateFrom);
        this.analytics.click('button', 'New project - Select template from');
    }

    @action
    selectRegion(region: Region) {
        this.set('selectedRegion', region);
        this.analytics.click('button', 'New project - Select storage region');
    }

    @action
    toggleMore() {
        this.toggleProperty('more');
    }

    @action
    create(this: NewProjectModal) {
        taskFor(this.createNodeTask).perform(
            this.nodeTitle,
            this.description,
            this.selectedInstitutions,
            this.templateFrom,
            this.selectedRegion,
            this.isPublic,
        );
    }

    @action
    searchNodes(this: NewProjectModal, searchTerm: string) {
        return taskFor(this.searchUserNodesTask).perform(searchTerm);
    }
}
