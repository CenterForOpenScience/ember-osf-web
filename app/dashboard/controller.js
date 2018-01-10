import { computed } from '@ember/object';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';

// const prodLinkedNodePath = id => `https://api.osf.io/v2/nodes/${id}/linked_nodes/?page[size]=5`;
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
                this.set('_nodes', nodes.slice());
                const pages = Math.ceil(nodes.meta.pagination.total / nodes.meta.pagination.per_page);
                this.set('totalPages', pages);
                this.set('loading', false);
                for (let i = 2; i <= pages; i++) { this.get('findNodes').perform(i); }
            });
        });

        this.get('store').findAll('institution').then(institutions => this.set('institutions', institutions));
        this.get('getPopularAndNoteworthy').perform(popularNode, 'popular');
        this.get('getPopularAndNoteworthy').perform(noteworthyNode, 'noteworthy');
    },

    loading: true,
    curPage: 1,
    filter: '',
    sortBy: 'date',
    sortOrder: 'desc',
    modalOpen: false,
    _nodes: A([]),
    institutions: A([]),
    popular: A([]),
    noteworthy: A([]),

    nodes: computed('_nodes', 'filter', 'curPage', 'sortBy', 'sortOrder', function() {
        const nodes = this.get('_nodes').filter(each => each.get('title').toLowerCase().indexOf(this.get('filter').toLowerCase()) !== -1);
        if (this.get('sortBy') === 'date') {
            if (this.get('sortOrder') === 'asc') {
                nodes.reverse();
            }
        } else if (this.get('sortOrder') === 'asc') {
            nodes.sort((a, b) => ((a.get('title').toLowerCase() < b.get('title').toLowerCase()) ? -1 : 1));
        } else {
            nodes.sort((a, b) => ((a.get('title').toLowerCase() < b.get('title').toLowerCase()) ? 1 : -1));
        }
        return nodes.slice(0, this.get('curPage') * 10);
    }),

    hasMore: computed('totalPages', 'curPage', function() {
        return this.get('totalPages') ? this.get('totalPages') > this.get('curPage') : false;
    }),

    actions: {
        more() {
            this.incrementProperty('curPage');
        },
        sort(by, order) {
            this.set('sortBy', by);
            this.set('sortOrder', order);
        },
        setSortBy(by) {
            this.set('sortBy', by);
        },
        setSortOrder(order) {
            this.set('sortOrder', order);
        },
        toggleModal() {
            this.toggleProperty('modalOpen');
        },
    },

    findNodes: task(function* (page) {
        const user = yield this.get('currentUser.user');
        const nodes = yield user.query('nodes', { page, embed: 'contributors' });
        this.get('_nodes').pushObjects(nodes.slice());
    }).enqueue(),

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
