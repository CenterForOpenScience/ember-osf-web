import Ember from 'ember';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';

export default Controller.extend({
    currentUser: Ember.inject.service(),
    init() {
        this.get('currentUser.user').then((user) => {
            user.query('nodes', { embed: 'contributors' }).then((nodes) => {
                this.set('_nodes', nodes.slice());
                const pages = Math.ceil(nodes.meta.pagination.total / nodes.meta.pagination.per_page);
                this.set('totalPages', pages);
                for (let i = 2; i <= pages; i++) { this.get('findNodes').perform(i); }
            });
        });
    },
    findNodes: task(function* (page) {
        const user = yield this.get('currentUser.user');
        const nodes = yield user.query('nodes', { page, embed: 'contributors' });
        this.get('_nodes').pushObjects(nodes.slice());
    }).enqueue(),
    curPage: 1,
    filter: '',
    _nodes: Ember.A([]),
    nodes: Ember.computed('_nodes', 'filter', 'curPage', function() {
        return this.get('_nodes').filter(each => each.get('title').toLowerCase().indexOf(this.get('filter').toLowerCase()) !== -1).slice(0, this.get('curPage') * 10);
    }),
    hasMore: Ember.computed('totalPages', 'curPage', function() {
        return this.get('totalPages') ? this.get('totalPages') > this.get('curPage') : false;
    }),
    actions: {
        more() {
            this.incrementProperty('curPage');
        },
    },
});
