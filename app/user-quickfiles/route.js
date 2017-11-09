import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Analytics from 'ember-osf/mixins/analytics';

export default Route.extend(Analytics, {
    currentUser: service(),

    model(params) {
        return this.store.findRecord('user', params.user_id);
    },
    actions: {
        didTransition() {
            window.addEventListener('dragover', e => this._preventDrop(e));
            window.addEventListener('drop', e => this._preventDrop(e));
        },
    },
    _preventDrop(e) {
        if (e.target.id !== 'quickfiles-dropzone') {
            e.preventDefault();
            e.dataTransfer.effectAllowed = 'none';
            e.dataTransfer.dropEffect = 'none';
        }
    },
    afterModel(model, transition) {
        if (model.id !== this.get('currentUser.currentUserId')) {
            transition.send('track', 'view', 'track', 'Quick Files - Non-owner page view');
        }
    },
});
