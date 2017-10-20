import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        openFile(file) {
            if (file.get('guid')) {
                this.transitionToRoute('file-detail', file.get('guid'));
            } else {
                file.getGuid().then(() => this.transitionToRoute('file-detail', file.get('guid')));
            }
        },
    },
});
