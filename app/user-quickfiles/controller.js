import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Analytics from 'ember-osf/mixins/analytics';

export default Controller.extend(Analytics, {
    currentUser: service(),

    canEdit: computed('currentUser', 'model', function() {
        if (!this.get('model.id')) return false;
        return (this.get('model.id') === this.get('currentUser.currentUserId'));
    }),

    title: computed('model.fullName', function() {
        return `${this.get('model.fullName')}'s Quick Files`;
    }),

    actions: {
        openFile(file, options) {
            const view = options ? 'revision' : 'view';
            if (file.get('guid')) {
                this.transitionToRoute('file-detail', file.get('guid'), { queryParams: { show: view } });
            } else {
                file.getGuid().then(() => this.transitionToRoute('file-detail', file.get('guid'), { queryParams: { show: view } }));
            }
        },
    },
});
