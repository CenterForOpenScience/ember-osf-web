import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Analytics from 'ember-osf/mixins/analytics';

export default class UserQuickfiles extends Controller.extend(Analytics, {
    actions: {
        async openFile(this: UserQuickfiles, file, show) {
            const guid = file.get('guid') || await file.getGuid();
            this.transitionToRoute('file-detail', guid, { queryParams: { show } });
        },
    },
}) {
    private currentUser = service('currentUser');
    private pageName = 'QuickFiles';

    private canEdit = computed('currentUser', 'model', function(this: UserQuickfiles): boolean {
        const modelId = this.get('model.id');

        return modelId && modelId === this.get('currentUser.currentUserId');
    });
}

declare module '@ember/controller' {
    interface IRegistry {
        'user-quickfiles': UserQuickfiles;
    }
}
