import { action, computed } from '@ember-decorators/object';
import { oneWay } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import Institution from 'ember-osf-web/models/institution';
import Node from 'ember-osf-web/models/node';
import Region from 'ember-osf-web/models/region';
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
    setupTask: task(function *(this: NewProjectModal) {
        if (this.storageI18nEnabled) {
            // not yielding so it runs in parallel
            this.get('setupStorageI18nTask').perform();
        }
        this.set('institutions', yield this.currentUser.user!.institutions);
    }).on('init'),

    setupStorageI18nTask: task(function *(this: NewProjectModal) {
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
    newNode?: Node;
    searchNodes!: (title: string) => PromiseLike<Node[]>;
    createProject!: (...args: any[]) => void;
    closeModal!: (reload?: boolean) => void;

    // Private fields
    nodeTitle?: string;
    description?: string;
    styleNamespace?: string;
    more: boolean = false;
    templateFrom?: Node;
    selectedRegion?: Region;
    institutions: Institution[] = [];
    regions: Region[] = [];

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
    }

    @action
    selectAllInstitutions(this: NewProjectModal) {
        this.set('selectedInstitutions', this.institutions.slice());
    }

    @action
    removeAllInstitutions(this: NewProjectModal) {
        this.set('selectedInstitutions', A([]));
    }

    @action
    selectTemplateFrom(this: NewProjectModal, templateFrom: Node) {
        this.set('templateFrom', templateFrom);
        this.analytics.click('button', 'Dashboard - New Project - Select template from');
    }

    @action
    selectRegion(this: NewProjectModal, region: Region) {
        this.set('selectedRegion', region);
        this.analytics.click('button', 'Dashboard - New Project - Select storage region');
    }

    @action
    toggleMore() {
        this.toggleProperty('more');
        this.analytics.click('button', 'Dashboard - New Project - Toggle more');
    }

    @action
    create() {
        this.createProject(
            this.nodeTitle,
            this.description,
            this.selectedInstitutions,
            this.templateFrom,
            this.selectedRegion,
        );
    }
}
