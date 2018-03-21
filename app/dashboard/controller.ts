import { A } from '@ember/array';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias, oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import config from 'ember-get-config';

// TODO pull these from the database
const {
    dashboard: {
        noteworthyNode,
        popularNode,
    },
} = config;

export default class Dashboard extends Controller.extend({
    currentUser: service('currentUser'),

    filter: null,
    loading: false,
    loadingMore: false,
    loadingSearch: false,
    modalOpen: false,
    newNode: null,
    page: 1,
    sort: '',

    institutions: A([]),
    nodes: A([]),
    noteworthy: A([]),
    popular: A([]),

    user: alias('currentUser.user'),

    institutionsSelected: oneWay('user.institutions'),

    actions: {
        more() {
            this.get('findNodes').perform(true);
        },
        sort(sort) {
            this.setProperties({ sort });
            this.get('findNodes').perform();
        },
        selectInstitution(this: NewProjectModal, institution) {
            const selected = this.set('institutionsSelected', this.get('institutionsSelected').slice());

            if (selected.includes(institution)) {
                selected.removeObject(institution);
            } else {
                selected.pushObject(institution);
            }
        },
        selectAllInstitutions(this: NewProjectModal) {
            this.set('institutionsSelected', this.get('user.institutions').slice());
        },
        removeAllInstitutions(this: NewProjectModal) {
            this.set('institutionsSelected', A([]));
        },
        toggleModal() {
            if (this.get('modalOpen')) {
                this.set('newNode', null);
            }

            this.toggleProperty('modalOpen');
        },
        closeModal(reload = false) {
            // Need to explicitly pass reload when the action in the onclick event of a button
            // otherwise the first argument is a mouse event which in turn is always truthy

            this.closeModal();
            if (reload) {
                this.get('findNodes').perform();
            }
        },
    },

    getInstitutions: task(function* (this: Dashboard) {
        this.set('institutions', yield this.get('store').findAll('institution'));
    }).restartable(),

    initialLoad: task(function* (this: Dashboard) {
        yield this.get('findNodes').perform();
    }),

    filterNodes: task(function* (this: Dashboard, filter) {
        yield timeout(500);
        this.setProperties({ filter });
        yield this.get('findNodes').perform(false, true);
    }).restartable(),

    findNodes: task(function* (this: Dashboard, more?: boolean) {
        const indicatorProperty = `loading${more ? 'More' : ''}`;

        const filter = this.get('filter');

        this.set(indicatorProperty, true);

        const user = yield this.get('currentUser.user');

        const nodes = yield user.queryHasMany('nodes', {
            embed: 'contributors',
            filter: filter ? { title: filter } : undefined,
            page: more ? this.incrementProperty('page') : this.set('page', 1),
            sort: this.get('sort') || undefined,
        });

        if (more) {
            this.get('nodes').pushObjects(nodes);
        } else {
            this.set('nodes', nodes);
        }

        this.set(indicatorProperty, false);
    }).restartable(),

    getPopularAndNoteworthy: task(function* (this: Dashboard, id, dest) {
        try {
            const node = yield this.get('store').findRecord('node', id);
            const linkedNodes = yield node.queryHasMany('linkedNodes', {
                embed: 'contributors',
                page: { size: 5 },
            });
            this.set(dest, linkedNodes);
        } catch (e) {
            this.set(`failedLoading-${dest}`, true);
        }
    }),

    searchNodes: task(function* (this: Dashboard, title) {
        yield timeout(500);
        const user = yield this.get('user');
        return yield user.queryHasMany('nodes', { filter: { title } });
    }).restartable(),

    createNode: task(function* (this: Dashboard, title, description, templateFrom) {
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

        const node = yield store.createRecord('node', data).save();

        if (this.get('institutionsSelected.length')) {
            const affiliatedInstitutions = yield node.get('affiliatedInstitutions');
            this.get('institutionsSelected').forEach(inst => affiliatedInstitutions.pushObject(inst));
            yield node.save();
        }

        this.set('newNode', node);
    }).drop(),
}) {
    page: number;
    loading: boolean;
    loadingMore: boolean;
    filter: string;
    sort: string;
    modalOpen: boolean;

    store = service('store');

    institutionsSelected = computed.oneWay('user.institutions');

    hasNodes = computed('filter', 'nodes.meta.total', function (): boolean {
        return this.get('nodes.meta.total') || this.get('filter') !== null;
    });

    hasMore = computed('nodes.{length,meta.total}', function (): boolean {
        return this.get('nodes.length') < this.get('nodes.meta.total');
    });

    init() {
        this.get('initialLoad').perform();
        this.get('getInstitutions').perform();
        this.get('getPopularAndNoteworthy').perform(popularNode, 'popular');
        this.get('getPopularAndNoteworthy').perform(noteworthyNode, 'noteworthy');
    }

    closeModal() {
        this.setProperties({
            modalOpen: false,
            newNode: null,
        });
    }
}
