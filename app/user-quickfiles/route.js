import Route from '@ember/routing/route';

export default Route.extend({
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
});
