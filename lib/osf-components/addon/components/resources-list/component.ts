import { A } from '@ember/array';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

import RegistrationModel from 'ember-osf-web/models/registration';
import ResourceModel from 'ember-osf-web/models/resource';

interface ResourcesListArgs {
    registration: RegistrationModel;
}

export default class ResourcesListComponent extends Component<ResourcesListArgs> {
    @tracked resourcesList: ResourceModel[] = A([]);
    @tracked resourcesPage = 1;
    @tracked totalResources = 0;

    get hasMore() {
        return this.totalResources > this.resourcesList.length;
    }

    get isLoading() {
        return taskFor(this.loadResources).isRunning;
    }

    @action
    reload() {
        this.resourcesList = A([]);
        this.resourcesPage = 1;
        taskFor(this.loadResources).perform();
    }

    @action
    loadMore() {
        taskFor(this.loadResources).perform();
    }

    @task
    @waitFor
    async loadResources() {
        const resourceList = await this.args.registration.queryHasMany('resources',
            {
                page: this.resourcesPage,
            });
        this.totalResources = resourceList.meta.total;
        this.resourcesList.pushObjects(resourceList);
        this.resourcesPage += 1;
    }

    constructor(owner: unknown, args: ResourcesListArgs) {
        super(owner, args);
        assert('ResourcesListComponent requires a registration', this.args.registration);
        taskFor(this.loadResources).perform();
    }
}
