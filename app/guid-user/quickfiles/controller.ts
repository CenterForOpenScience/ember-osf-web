import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Analytics from 'ember-osf-web/mixins/analytics';

export default class UserQuickfiles extends Controller.extend(Analytics, {
    actions: {
        async openFile(this: UserQuickfiles, file, show) {
            const guid = file.get('guid') || await file.getGuid();
            this.transitionToRoute('guid-file', guid, { queryParams: { show } });
        },
    },
}) {
    currentUser = service('currentUser');
    pageName = 'QuickFiles';

    user = computed.alias('model.taskInstance.value');

    canEdit = computed('currentUser.currentUserId', 'user.id', function(this: UserQuickfiles): boolean {
        const userId = this.get('user.id');
        return userId && userId === this.get('currentUser.currentUserId');
    });
}

declare module '@ember/controller' {
    interface Registry {
        'guid-user/quickfiles': UserQuickfiles;
    }
}
