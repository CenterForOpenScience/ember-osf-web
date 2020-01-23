import { A } from '@ember/array';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import Institution from 'ember-osf-web/models/institution';
import Node from 'ember-osf-web/models/node';
import Region from 'ember-osf-web/models/region';
import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
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
    @service store!: DS.Store;
    @service features!: Features;

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
    initTask = task(function *(this: NewProjectModal) {
        if (this.storageI18nEnabled) {
            // not yielding so it runs in parallel
            this.get('getStorageRegionsTask').perform();
        }
        this.set('institutions', yield this.currentUser.user!.institutions);
    });

    @task
    getStorageRegionsTask = task(function *(this: NewProjectModal) {
        const regions = yield this.store.findAll('region');

        this.setProperties({
            regions: regions.toArray(),
            selectedRegion: this.currentUser.user!.defaultRegion,
        });
    });

    @task
    loadDefaultRegionTask = task(function *(this: NewProjectModal) {
        const { user } = this.currentUser;
        if (!user) {
            return;
        }

        yield user.belongsTo('defaultRegion').reload();
    });

    @task({ restartable: true })
    searchUserNodesTask = task(function *(this: NewProjectModal, title: string) {
        yield timeout(500);
        const user: User = yield this.user;
        return yield user.queryHasMany('nodes', { filter: { title } });
    });

    @task({ drop: true })
    createNodeTask = task(function *(
        this: NewProjectModal,
        title: string,
        description: string,
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
        yield node.save();

        this.afterProjectCreated(node);
    });

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
        this.get('createNodeTask').perform(
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
        return this.get('searchUserNodesTask').perform(searchTerm);
    }
}
