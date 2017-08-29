import Ember from 'ember';

export default Ember.Controller.extend({
    displays: Ember.A([]),
    userId: Ember.computed('model', function() {
        // let link = this.get('model')._internalModel._relationships.initializedRelationships.user.link; //hack to get id without having to request it
        // return link.split('/')[link.split('/').indexOf('users') + 1]; 
        let model = this.get('model');
        return model.get('user').then(user => user.get('id'));
    }),
    actions: {
        download() {
            window.location = this.get('model.links.download');
        },
        openFile(file) {
            this.transitionToRoute('file-detail', file);
        }
    }
});
