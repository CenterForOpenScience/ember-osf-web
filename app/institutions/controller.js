import Ember from 'ember';

export default Ember.Controller.extend({
    store: Ember.inject.service(),
    sort: 'asc',
    page: 1,
    institutions: Ember.computed('model', 'sort', 'page', function() {
        let sorted = this.get('model').sortBy('name');
        if (this.get('sort') === 'des') { sorted.reverse(); }
        return sorted.slice(0, 10*this.get('page'));
    }),
    hasMore: Ember.computed('institutions', 'model', function() {
        return this.get('institutions.length') !== this.get('model.length');
    }),
    actions: {
        next() {
            this.incrementProperty('page');
        },
        sort(sortOrder) {
            Ember.$('.sorting').removeClass('active');
            Ember.$(`.name${sortOrder}`).addClass('active');
            this.set('sort', sortOrder);
        },
        goTo(id) {
            window.location = id;
        }
    }
});
