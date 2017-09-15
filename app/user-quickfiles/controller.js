import Ember from 'ember';

export default Ember.Controller.extend({
    title: Ember.computed('model.givenName', function() {
        return `${this.get('model.givenName')}'s Quickfiles`;
    }),
    actions: {
        openFile(file) {
            if (file.get('guid')) {
                this.transitionToRoute('file-detail', file.get('guid'));
            } else {
                window.location = `/quickfiles${file.get('path')}`;
            }
        }
    }
});
