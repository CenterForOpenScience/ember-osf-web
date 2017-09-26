import { computed } from '@ember/object';
import { A } from '@ember/array';
import Controller from '@ember/controller';

export default Controller.extend({
    displays: A([]),
    userId: computed('model', function() {
        // let link = this.get('model')._internalModel._relationships.initializedRelationships.user.link; //hack to get id without having to request it
        // return link.split('/')[link.split('/').indexOf('users') + 1];
        const model = this.get('model');
        return model.get('user').then(user => user.get('id'));
    }),
    actions: {
        download() {
            window.location = this.get('model.links.download');
        },
        openFile(file) {
            if (file.get('guid')) {
                this.transitionToRoute('file-detail', file.get('guid'));
            } else {
                window.location = `/file_redirect${file.get('path')}`;
            }
        },
    },
});
