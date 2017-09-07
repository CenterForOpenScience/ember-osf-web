import Ember from 'ember';

export default Ember.Controller.extend({
    displays: Ember.A([]),
    userId: Ember.computed('model', function() {
        return this.get('model.user.id');
    }),
    actions: {
        share() {
            // Share the document being viewed
        },
        download() {
            window.location = this.get('model.links.download');
        },
        changeView() {
            // Change the view to either the normal view or the revision table view
            $('#mfrIframeParent').toggle();
            $('#revisionsPanel').toggle();
            $('.view-button').toggleClass('btn-default btn-primary');
        },
        openFile(file) {
            let fileID = file.get('guid') ? file.get('guid') : file.id;
            this.transitionToRoute('file-detail', fileID);
        }
    }
});
