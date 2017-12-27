import Ember from 'ember';
import Controller from '@ember/controller';

export default Controller.extend({
    currentUser: Ember.inject.service(),
    init() {
        this.get('currentUser.user').then((user) => {
            user.query('nodes', { embed: 'contributors' }).then((nodes) => {
                this.set('nodes', nodes);
                this.set('totalPages', nodes.meta.pagination.total / 10 | 1); // eslint-disable-line no-bitwise
            });
        });
    },
    curPage: 1,
    nodes: Ember.A([]),
    hasMore: Ember.computed('totalPages', 'curPage', function() {
        return this.get('totalPages') ? this.get('totalPages') > this.get('curPage') : false;
    }),
    actions: {
        more() {
            this.set('curPage', this.get('curPage') + 1);
            this.get('currentUser.user').then((user) => {
                user.query('nodes', {
                    embed: 'contributors',
                    page: this.get('curPage'),
                }).then((nodes) => {
                    this.get('nodes').pushObjects(nodes);
                });
            });
        },
    },
});
