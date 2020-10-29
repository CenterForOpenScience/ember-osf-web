import { A } from '@ember/array';
import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { alias, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { all, timeout } from 'ember-concurrency';
import { restartableTask, task } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';
import DS from 'ember-data';
import config from 'ember-get-config';

import Institution from 'ember-osf-web/models/institution';
import Node from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import SparseNodeModel from 'ember-osf-web/models/sparse-node';
import User from 'ember-osf-web/models/user';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';

// TODO pull these from the database
const {
    dashboard: {
        noteworthyNode,
        popularNode,
    },
} = config;

export default class Dashboard extends Controller {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;

    page: number = 1;
    loading: boolean = false;
    loadingSearch: boolean = false;
    loadingMore: boolean = false;
    initialLoad: boolean = true;
    // Initialized in setupController.
    filter!: string | null;
    sort: string = '-last_logged';
    modalOpen: boolean = false;
    newNode: Node | null = null;
    showNewNodeNavigation: boolean = false;
    'failedLoading-noteworthy': boolean = false;
    'failedLoading-popular': boolean = false;

    institutions: Institution[] = A([]);
    nodes?: QueryHasManyResult<SparseNodeModel>;
    noteworthy!: QueryHasManyResult<Node>;
    popular!: QueryHasManyResult<Node>;

    @alias('currentUser.user') user!: User;

    @or('nodes.length', 'filter', 'findNodes.isRunning') hasNodes!: boolean;

    @restartableTask({ withTestWaiter: true })
    async filterNodes(filter: string) {
        await timeout(500);
        this.setProperties({ filter });
        this.analytics.track('list', 'filter', 'Dashboard - Search projects');
        await taskFor(this.findNodes).perform();
    }

    @restartableTask({ withTestWaiter: true })
    async findNodes(more?: boolean) {
        const indicatorProperty = more ? 'loadingMore' : 'loading';
        this.set(indicatorProperty, true);

        const user = await this.currentUser.user;

        const nodes = await user!.queryHasMany('sparseNodes', {
            embed: ['bibliographic_contributors', 'parent', 'root'],
            // eslint-disable-next-line ember/no-global-jquery
            filter: this.filter ? { title: $('<div>').text(this.filter).html() } : undefined,
            page: more ? this.incrementProperty('page') : this.set('page', 1),
            sort: this.sort || undefined,
        });

        if (more && this.nodes) {
            this.nodes.pushObjects(nodes);
        } else {
            this.set('nodes', nodes);
        }

        this.set(indicatorProperty, false);
        this.set('initialLoad', false);
    }

    @task({ withTestWaiter: true })
    async getPopularAndNoteworthy(id: string, dest: 'noteworthy' | 'popular') {
        try {
            const node = await this.store.findRecord('node', id);
            const linkedNodes = await node.queryHasMany('linkedNodes', {
                embed: 'bibliographic_contributors',
                page: { size: 5 },
            });
            this.set(dest, linkedNodes);
        } catch (e) {
            const failedProperty = `failedLoading-${dest}` as 'failedLoading-noteworthy' | 'failedLoading-popular';
            this.set(failedProperty, true);
        }
    }

    @restartableTask({ withTestWaiter: true })
    async setupTask() {
        this.set('filter', null);

        const institutions = this.store.findAll('institution');

        await all([
            institutions,
            taskFor(this.findNodes).perform(),
            taskFor(this.getPopularAndNoteworthy).perform(popularNode, 'popular'),
            taskFor(this.getPopularAndNoteworthy).perform(noteworthyNode, 'noteworthy'),
        ]);

        this.set('institutions', institutions.toArray());
    }

    @computed('nodes.{length,meta.total}')
    get hasMore(): boolean {
        return !!this.nodes && this.nodes.length < this.nodes.meta.total;
    }

    @action
    more() {
        taskFor(this.findNodes).perform(true);
    }

    @action
    sortProjects(sort: string) {
        this.setProperties({ sort });
        taskFor(this.findNodes).perform();
    }

    @action
    openModal() {
        this.set('modalOpen', true);
    }

    @action
    closeModal() {
        this.setProperties({
            modalOpen: false,
            newNode: null,
            showNewNodeNavigation: false,
        });
    }

    @action
    afterStay() {
        taskFor(this.findNodes).perform();
    }

    @action
    projectCreated(newNode: Node) {
        this.set('newNode', newNode);
        this.set('showNewNodeNavigation', true);
    }
}
