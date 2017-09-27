import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
    title: computed('model.givenName', function() {
        return `${this.get('model.fullName')}'s Quick Files`;
    }),
    actions: {
        openFile(file) {
            if (file.get('guid')) {
                this.transitionToRoute('file-detail', file.get('guid'));
            } else {
                window.location = `/file_redirect${file.get('path')}`;
            }
        },
    },
});
