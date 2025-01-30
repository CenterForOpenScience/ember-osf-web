import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';


import ConfiguredStorageAddonModel from 'ember-osf-web/models/configured-storage-addon';
import NodeModel from 'ember-osf-web/models/node';
import getHref from 'ember-osf-web/utils/get-href';
import Features from 'ember-feature-flags';

interface InputArgs {
    node: NodeModel;
}

export default class FileProviderList extends Component<InputArgs> {
    @service store!: Store;
    @service features!: Features;

    constructor(owner: any, args: InputArgs) {
        super(owner, args);
        if (this.features.isEnabled('gravy_waffle')) {
            taskFor(this.loadConfiguredAddons).perform(this._connectedResourceIri);
        }
    }

    get configuredStorageAddons() {
        return taskFor(this.loadConfiguredAddons).lastSuccessful?.value || [];
    }

    get _connectedResourceIri(): string {
        return getHref(this.args.node.links.iri!);
    }

    @task
    @waitFor
    async loadConfiguredAddons(resourceIri: string): Promise<ConfiguredStorageAddonModel[]> {
        const _connectedResources = await this.store.query('resource-reference', {
            filter: {resource_uri: resourceIri},
        });
        return await _connectedResources.firstObject?.hasMany('configuredStorageAddons').load();
    }
}
