import { computed } from '@ember/object';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';

const popularNode = '57tnq';
const noteworthyNode = 'z3sg2';

export default Controller.extend({
    currentUser: service(),

    init() {
        this.get('currentUser.user').then((user) => {
            if (!user) {
                return;
            }
            user.query('nodes', { embed: 'contributors' }).then((nodes) => {
                this.set('nodes', nodes.slice());
                this.set('totalNodes', nodes.meta.total);
                const pages = Math.ceil(nodes.meta.pagination.total / nodes.meta.pagination.per_page);
                this.set('totalPages', pages);
                this.set('initialLoading', false);
            });
        });

        this.get('store').findAll('institution').then(institutions => this.set('institutions', institutions));
        this.get('getPopularAndNoteworthy').perform(popularNode, 'popular');
        this.get('getPopularAndNoteworthy').perform(noteworthyNode, 'noteworthy');
    },

    loading: false,
    loadingMore: false,
    initialLoading: true,
    curPage: 1,
    filter: '',
    sortBy: 'date',
    sortOrder: 'desc',
    modalOpen: false,
    nodes: A([]),
    institutions: A([]),
    popular: A([]),
    noteworthy: A([]),

    hasMore: computed('nodes.length', function() {
        if (this.get('nodes.length') < 10) {
            return false;
        }
        return this.get('totalPages') ? this.get('totalPages') > this.get('curPage') : false;
    }),

    actions: {
        more() {
            this.incrementProperty('curPage');
            this.get('findNodes').perform(true);
        },
        sort(by, order) {
            this.set('sortBy', by);
            this.set('sortOrder', order);
            this.get('findNodes').perform();
        },
        setSortBy(by) {
            this.set('sortBy', by);
            this.get('findNodes').perform();
        },
        setSortOrder(order) {
            this.set('sortOrder', order);
            this.get('findNodes').perform();
        },
        toggleModal() {
            this.toggleProperty('modalOpen');
        },
    },

    filterNodes: task(function* (term) {
        this.set('filter', term);
        yield timeout(500);
        this.get('findNodes').perform();
    }).restartable(),

    findNodes: task(function* (more) {
        this.set(more ? 'loadingMore' : 'loading', true);
        const user = yield this.get('currentUser.user');
        const query = { embed: 'contributors', filter: {} };
        query.sort = `${this.get('sortOrder') === 'desc' ? '-' : ''}${this.get('sortBy')}`;
        query.filter.title = this.get('filter');
        if (more) {
            query.page = this.get('curPage');
        } else {
            this.set('loading', true);
            query.page = 1;
            this.set('curPage', 1);
        }
        const nodes = yield user.query('nodes', query);
        const pages = Math.ceil(nodes.meta.pagination.total / nodes.meta.pagination.per_page);
        this.set('totalPages', pages);
        this.set(more ? 'loadingMore' : 'loading', false);
        if (more) {
            this.get('nodes').pushObjects(nodes.slice());
        } else {
            this.set('nodes', nodes.slice());
        }
    }).restartable(),

    getPopularAndNoteworthy: task(function* (id, dest) {
        // const url = prodLinkedNodePath(id);
        try {
            const node = yield this.get('store').findRecord('node', id);
            const linkedNodes = yield node.query('linkedNodes', { page: { size: 5 }, embed: 'contributors' });
            this.get(dest).pushObjects(linkedNodes.slice());
        } catch (e) {
            this.set(`failedLoading-${dest}`, true);
        }
    }),
});
