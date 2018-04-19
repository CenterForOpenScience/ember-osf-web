import { action, computed } from '@ember-decorators/object';
import { alias, oneWay, or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import { A } from '@ember/array';
import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';

interface QueryHasManyResponse<T> extends Array<T> {
    meta?: {
        total?: number;
    };
    get: (key: string) => any;
}

export default class Dashboard extends Controller {
    @service analytics;
    @service currentUser;
    @service store;

    page: number = 1;
    loading: boolean = false;
    loadingSearch: boolean = false;
    loadingMore: boolean = false;
    initialLoad: boolean = true;
    filter: string = '';
    sort: string = '-last_logged';
    modalOpen: boolean = false;
    newNode = null;
    'failedLoading-noteworthy': boolean = false;
    'failedLoading-popular': boolean = false;

    institutions = A([]);
    nodes: QueryHasManyResponse<Node> = A([]);
    noteworthy = A([]);
    popular = A([]);

    getInstitutions = task(function* (this: Dashboard) {
        this.set('institutions', yield this.get('store').findAll('institution'));
    }).restartable();

    filterNodes = task(function* (this: Dashboard, filter) {
        yield timeout(500);
        this.setProperties({ filter });
        yield this.get('findNodes').perform();
    }).restartable();

    findNodes = task(function* (this: Dashboard, more?: boolean) {
        const indicatorProperty = more ? 'loadingMore' : 'loading';
        const filter = this.get('filter');

        this.set(indicatorProperty, true);

        const user = yield this.get('currentUser').get('user');

        const nodes = yield user.queryHasMany('nodes', {
            embed: ['contributors', 'parent', 'root'],
            filter: filter ? { title: $('<div>').text(filter).html() } : undefined,
            page: more ? this.incrementProperty('page') : this.set('page', 1),
            sort: this.get('sort') || undefined,
        });

        if (more) {
            this.get('nodes').pushObjects(nodes);
        } else {
            this.set('nodes', nodes);
        }

        this.set(indicatorProperty, false);
        this.set('initialLoad', false);
        this.set('loading', false);
    }).restartable();

    getPopularAndNoteworthy = task(function* (this: Dashboard, id: string, dest: 'noteworthy' | 'popular') {
        try {
            const node = yield this.get('store').findRecord('node', id);
            const linkedNodes = yield node.queryHasMany('linkedNodes', {
                embed: 'contributors',
                page: { size: 5 },
            });
            this.set(dest, linkedNodes);
        } catch (e) {
            const failedProperty = `failedLoading-${dest}` as 'failedLoading-noteworthy' | 'failedLoading-popular';
            this.set(failedProperty, true);
        }
    });

    searchNodes = task(function* (this: Dashboard, title) {
        yield timeout(500);
        const user = yield this.get('user');
        return yield user.queryHasMany('nodes', { filter: { title } });
    }).restartable();

    createNode = task(function* (this: Dashboard, title, description, templateFrom) {
        if (!title) {
            return;
        }
        const store = this.get('store');
        const data = {
            category: 'project',
            description,
            public: false,
            templateFrom,
            title,
        };
        const node = store.createRecord('node', data);
        const institutions = this.get('institutionsSelected');
        if (institutions.length) {
            node.set('affiliatedInstitutions', institutions.slice());
        }
        yield node.save();

        this.set('newNode', node);
    }).drop();

    @alias('currentUser.user') user;
    @oneWay('user.institutions') institutionsSelected;

    @or('nodes.length', 'filter', 'findNodes.isRunning') hasNodes;

    @computed('nodes.{length,meta.total}')
    get hasMore(this: Dashboard): boolean {
        return this.get('nodes').length < this.get('nodes').get('meta.total');
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
    selectInstitution(this: Dashboard, institution) {
        const selected = this.set('institutionsSelected', this.get('institutionsSelected').slice());

        if (selected.includes(institution)) {
            selected.removeObject(institution);
        } else {
            selected.pushObject(institution);
        }
    }

    @action
    selectAllInstitutions(this: Dashboard) {
        this.set('institutionsSelected', this.get('user').get('institutions').slice());
    }

    @action
    removeAllInstitutions(this: Dashboard) {
        this.set('institutionsSelected', A([]));
    }

    @action
    toggleModal(this: Dashboard) {
        if (this.get('modalOpen')) {
            this.set('newNode', null);
        }

        this.toggleProperty('modalOpen');
    }

    @action
    closeModal(this: Dashboard, reload = false) {
        // Need to explicitly pass reload when the action in the onclick event of a button
        // otherwise the first argument is a mouse event which in turn is always truthy

        this.setProperties({
            modalOpen: false,
            newNode: null,
        });

        if (reload) {
            this.get('findNodes').perform();
        }
    }
}
