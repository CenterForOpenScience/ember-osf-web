import Ember from 'ember';


export default Ember.Controller.extend({
    displays: Ember.A([]),
    userId: Ember.computed('model', function() {
        return this.get('model.user');
    }),
    isAdmin: Ember.computed('model', function() {
        // True if the current user has admin permissions for the node that contains the preprint
        //return (this.get('model.user.currentUserPermissions') || []).includes(permissions.ADMIN);
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
            // TODO: When the user chooses a new file, the file-widget temporarily goes AWOL
            let fileID = file.get('guid') ? file.get('guid') : file.id;
            this.transitionToRoute('file-detail', fileID);
        },
        // Custom addATag method that appends tag to list instead of auto-saving
        addTag(tag) {
            Ember.get(this, 'metrics')
                .trackEvent({
                    category: 'input',
                    action: 'onchange',
                    label: `${this.get('editMode') ? 'Edit' : 'Submit'} - Add Tag`
                });

            this.get('fileTags').pushObject(tag);
        },
        // Custom removeATag method that removes tag from list instead of auto-saving
        removeTag(tag) {
            Ember.get(this, 'metrics')
                .trackEvent({
                    category: 'button',
                    action: 'click',
                    label: `${this.get('editMode') ? 'Edit' : 'Submit'} - Remove Tag`
                });

            this.get('fileTags').removeObject(tag);
        },
    }
});
