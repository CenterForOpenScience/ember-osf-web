import { action, computed } from '@ember-decorators/object';
import { alias, or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Controller from '@ember/controller';
import { all, task, timeout } from 'ember-concurrency';
import DS from 'ember-data';
import config from 'ember-get-config';

import Institution from 'ember-osf-web/models/institution';
import Node from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
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
    nodes?: QueryHasManyResult<Node>;
    noteworthy!: QueryHasManyResult<Node>;
    popular!: QueryHasManyResult<Node>;

    setupTask = task(function *(this: Dashboard) {
        this.set('filter', null);

        const institutions = this.store.findAll('institution');

        yield all([
            institutions,
            this.get('findNodes').perform(),
            this.get('getPopularAndNoteworthy').perform(popularNode, 'popular'),
            this.get('getPopularAndNoteworthy').perform(noteworthyNode, 'noteworthy'),
        ]);

        this.set('institutions', institutions.toArray());
    }).restartable();

    filterNodes = task(function *(this: Dashboard, filter: string) {
        yield timeout(500);
        this.setProperties({ filter });
        this.analytics.track('list', 'filter', 'Dashboard - Search projects');
        yield this.get('findNodes').perform();
    }).restartable();

    findNodes = task(function *(this: Dashboard, more?: boolean) {
        const indicatorProperty = more ? 'loadingMore' : 'loading';
        this.set(indicatorProperty, true);

        const user: User = yield this.currentUser.user;

        const nodes: QueryHasManyResult<Node> = yield user.queryHasMany('nodes', {
            embed: ['contributors', 'parent', 'root'],
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
    }).restartable();

    getPopularAndNoteworthy = task(function *(this: Dashboard, id: string, dest: 'noteworthy' | 'popular') {
        try {
            const node: Node = yield this.store.findRecord('node', id);
            const linkedNodes: QueryHasManyResult<Node> = yield node.queryHasMany('linkedNodes', {
                embed: 'contributors',
                page: { size: 5 },
            });
            this.set(dest, linkedNodes);
        } catch (e) {
            const failedProperty = `failedLoading-${dest}` as 'failedLoading-noteworthy' | 'failedLoading-popular';
            this.set(failedProperty, true);
        }
    });

    @alias('currentUser.user') user!: User;

    @or('nodes.length', 'filter', 'findNodes.isRunning') hasNodes!: boolean;

    @computed('nodes.{length,meta.total}')
    get hasMore(): boolean {
        return !!this.nodes && this.nodes.length < this.nodes.meta.total;
    }

    @action
    more(this: Dashboard) {
        this.get('findNodes').perform(true);
    }

    @action
    sortProjects(this: Dashboard, sort: string) {
        this.setProperties({ sort });
        this.get('findNodes').perform();
    }

    @action
    openModal(this: Dashboard) {
        this.set('modalOpen', true);
    }

    @action
    closeModal(this: Dashboard) {
        this.setProperties({
            modalOpen: false,
            newNode: null,
            showNewNodeNavigation: false,
        });
    }

    @action
    afterStay(this: Dashboard) {
        this.get('findNodes').perform();
    }

    @action
    projectCreated(this: Dashboard, newNode: Node) {
        this.set('newNode', newNode);
        this.set('showNewNodeNavigation', true);
    }
}
