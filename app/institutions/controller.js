import Ember from 'ember';

export default Ember.Controller.extend({
    store: Ember.inject.service(),
    sort: 'asc',
    page: 1,
    textValue: '',
    institutions: Ember.computed('model', 'sort', 'page', 'textValue', function() {
        const filtered = this.get('textValue.length') ? this.get('model').filter(i => i.get('name').toLowerCase().indexOf(this.get('textValue').toLowerCase()) !== -1) : this.get('model');
        const sorted = filtered.sortBy('name');
        if (this.get('sort') === 'des') { sorted.reverse(); }
        return sorted.slice(0, 10 * this.get('page'));
    }),
    hasMore: Ember.computed('institutions', 'model', 'textValue', function() {
        if (this.get('textValue.length')) {
            return this.get('institutions.length') !== this.get('model').filter(i => i.get('name').toLowerCase().indexOf(this.get('textValue').toLowerCase()) !== -1).length;
        }
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
        },
    },
});
