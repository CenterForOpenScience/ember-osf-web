import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        download() {
            window.location = this.get('model.links.download');
        }
    }
});
