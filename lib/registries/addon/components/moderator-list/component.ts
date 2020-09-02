import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import ModeratorModel from 'ember-osf-web/models/moderator';
import ProviderModel from 'ember-osf-web/models/provider';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import template from './template';

@tagName('')
@layout(template)
export default class ModeratorList extends Component {
    @service currentUser!: CurrentUserService;
    @service toast!: Toast;
    moderators!: ModeratorModel[];
    provider!: ProviderModel;

    permissionOptions = ['Moderator', 'Admin']; // TODO: import the enum on the moderator model (coming soon)

    @computed('currentUser')
    get currentUserIsProviderAdmin(): boolean {
        if (this.currentUser && this.moderators) {
            const moderator = this.moderators.findBy('id', this.currentUser.currentUserId);
            return Boolean(moderator) && moderator!.permissionGroup === 'admin';
        }
        return false;
    }

    // TODO: Functionaity to adjust permissions (admins)
    // TODO: Functionality to remove self (moderators)
    // TODO: Functionality to add/remove others (admins)

    @task({ withTestWaiter: true, enqueue: true })
    updateModeratorPermission = task(function *(this: ModeratorList, moderator: ModeratorModel, newPermission: string) {
        try {
            moderator.set('permissionGroup', newPermission);
            yield moderator.save();
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
            throw e;
        }
    });

    @task({ withTestWaiter: true })
    removeModerator = task(function *(this: ModeratorList, moderator: ModeratorModel) {
        try {
            this.moderators.removeObject(moderator);
            yield moderator.destroyRecord({
                adapterOptions: {
                    provider: this.provider,
                },
            });
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
            throw e;
        }
    });
}
