import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';


import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';
import NodeModel from 'ember-osf-web/models/node';
import Features from 'ember-feature-flags';

interface InputArgs {
    node: NodeModel;
}

export default class FileProviderList extends Component<InputArgs> {
    @service store!: Store;
    @service features!: Features;

    @tracked configuredStorageAddons: ConfiguredStorageAddonModel[] = [];


    constructor(owner: any, args: InputArgs) {
        super(owner, args);
        if (args.node && this.features.isEnabled('gravy_waffle')) {
            taskFor(this.configuredStorageProviders).perform();
        }
    }

    @task
    @waitFor
    async configuredStorageProviders() {
        const _ref = await this.store.query('resource-reference', {
            filter: {resource_uri: encodeURI(this.args.node.links.iri as string)},
        });

        if (_ref.toArray().length > 0) {
            this.configuredStorageAddons = await _ref.toArray()[0].configuredStorageAddons;
        }
    }
}
