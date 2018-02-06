import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
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
        openFile(file, qparams) {
            if (file.get('guid')) {
                this.transitionToRoute('file-detail', file.get('guid'), { queryParams: { show: qparams } });
            } else {
                file.getGuid().then(() => this.transitionToRoute('file-detail', file.get('guid'), { queryParams: { show: qparams } }));
            }
        },
    },

    jiraComponent: config.microfeedback.JIRA.components.QuickFiles,
});
