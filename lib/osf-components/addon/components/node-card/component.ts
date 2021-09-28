import { tagName } from '@ember-decorators/component';
import Component from '@glimmer/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import Store from '@ember-data/store';

import { layout } from 'ember-osf-web/decorators/component';
import Node, { NodeType } from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import Analytics from 'ember-osf-web/services/analytics';
import pathJoin from 'ember-osf-web/utils/path-join';

import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import RouterService from '@ember/routing/router-service';
import RegistrationModel from 'ember-osf-web/models/registration';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';

import template from './template';
import styles from './styles';

interface Args {
    registration: RegistrationModel;
}

const { OSF: { url: baseURL } } = config;

@layout(template, styles)
@tagName('')
export default class NodeCard extends Component<Args> {
    @service analytics!: Analytics;
    @service router!: RouterService;
    @service store!: Store;
    // Optional parameters
    node?: Node | Registration;
    delete?: (node: Node) => void;
    showTags = false;
    readOnly = false;

    // Private properties
    searchUrl = pathJoin(baseURL, 'search');

    constructor(owner: unknown, args: Args) {
        super(owner, args);
    }

    @computed('readOnly', 'node', 'node.{nodeType,userHasWritePermission}')
    get showDropdown() {
        return !this.readOnly && this.node && this.node.nodeType === NodeType.Fork && this.node.userHasWritePermission;
    }

    @task
    @waitFor
    async createNewSchemaResponse() {
        const newRevision: SchemaResponseModel = this.store.createRecord('schema-response', {
            registration: this.args.registration,
        });
        await newRevision.save();
        this.router.transitionTo('registries.edit-revision', newRevision.id);
    }
}
