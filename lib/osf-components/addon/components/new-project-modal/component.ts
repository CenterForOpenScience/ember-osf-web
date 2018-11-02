import { action, computed } from '@ember-decorators/object';
import { alias, oneWay } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import DS from 'ember-data';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import requiredAction from 'ember-osf-web/decorators/required-action';
import Institution from 'ember-osf-web/models/institution';
import Node from 'ember-osf-web/models/node';
import Region from 'ember-osf-web/models/region';
import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import styles from './styles';
import layout from './template';

const {
    featureFlagNames: {
        storageI18n,
    },
} = config;

export default class NewProjectModal extends Component.extend({
    initTask: task(function *(this: NewProjectModal) {
        if (this.storageI18nEnabled) {
            // not yielding so it runs in parallel
            this.get('getStorageRegionsTask').perform();
        }
        this.set('institutions', yield this.currentUser.user!.institutions);
    }).on('init'),

    getStorageRegionsTask: task(function *(this: NewProjectModal) {
        const regions = yield this.store.findAll('region');

        this.setProperties({
            regions: regions.toArray(),
            selectedRegion: this.currentUser.user!.defaultRegion,
        });
    }),
}) {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;
    @service features!: Features;

    // Required arguments
    page!: string;
    @requiredAction afterProjectCreated!: (newNode: Node) => void;

    // Optional arguments
    isPublic?: boolean;

    // Private fields
    nodeTitle?: string;
    description?: string;
    styleNamespace?: string;
    more: boolean = false;
    templateFrom?: Node;
    selectedRegion?: Region;
    institutions: Institution[] = [];
    regions: Region[] = [];

    @alias('currentUser.user') user!: User;

    searchUserNodes = task(function *(this: NewProjectModal, title: string) {
        yield timeout(500);
        const user: User = yield this.user;
        return yield user.queryHasMany('nodes', { filter: { title } });
    }).restartable();

    createNode = task(function *(
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
    }).drop();

    @oneWay('institutions') selectedInstitutions!: Institution[];

    @computed()
    get storageI18nEnabled() {
        return this.features.isEnabled(storageI18n);
    }

    @action
    selectInstitution(this: NewProjectModal, institution: Institution) {
        const selected = this.set('selectedInstitutions', this.selectedInstitutions.slice());

        if (selected.includes(institution)) {
            selected.removeObject(institution);
        } else {
            selected.pushObject(institution);
        }
        this.analytics.click('button', `${this.page} - New Project - select_institution`);
    }

    @action
    selectAllInstitutions(this: NewProjectModal) {
        this.set('selectedInstitutions', this.institutions.slice());
        this.analytics.click('button', `${this.page} - New Project - select_all`);
    }

    @action
    removeAllInstitutions(this: NewProjectModal) {
        this.set('selectedInstitutions', A([]));
        this.analytics.click('button', `${this.page} - New Project - remove_all`);
    }

    @action
    selectTemplateFrom(this: NewProjectModal, templateFrom: Node) {
        this.set('templateFrom', templateFrom);
        this.analytics.click('button', `${this.page} - New Project - Select template from`);
    }

    @action
    selectRegion(this: NewProjectModal, region: Region) {
        this.set('selectedRegion', region);
        this.analytics.click('button', `${this.page} - New Project - Select storage region`);
    }

    @action
    toggleMore() {
        this.toggleProperty('more');
        this.analytics.click('button', `${this.page} - New Project - Toggle more`);
    }

    @action
    create(this: NewProjectModal) {
        this.get('createNode').perform(
            this.nodeTitle,
            this.description,
            this.selectedInstitutions,
            this.templateFrom,
            this.selectedRegion,
            this.isPublic,
        );
        this.analytics.click('button', `${this.page} - New Project - create`);
    }

    @action
    searchNodes(this: NewProjectModal, searchTerm: string) {
        return this.get('searchUserNodes').perform(searchTerm);
    }
}
