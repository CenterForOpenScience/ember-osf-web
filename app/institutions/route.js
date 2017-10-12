import Ember from 'ember';

export default Ember.Route.extend({
    store: Ember.inject.service(),
    model() {
        return this.get('store').query('institution', { page: 1 });
    }
});
