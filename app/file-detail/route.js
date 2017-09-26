import Route from '@ember/routing/route';

export default Ember.Route.extend({
    // store: Ember.inject.service(),
    model(params) {
        return Ember.RSVP.hash({
            file: this.store.findRecord('file', params.file_id),
            user: this.store.findRecord('file', params.file_id).then(file => file.get('user'))
        });
    }
});
