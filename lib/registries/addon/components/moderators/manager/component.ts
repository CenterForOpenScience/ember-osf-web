import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import ModeratorModel, { PermissionGroup } from 'ember-osf-web/models/moderator';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import template from './template';

@tagName('')
@layout(template)
export default class ModeratorManager extends Component {
    @service currentUser!: CurrentUserService;
    @service toast!: Toast;

    provider!: RegistrationProviderModel;
    permissionOptions = Object.values(PermissionGroup);

    @tracked moderators?: ModeratorModel[];

    @computed('currentUser.currentUserId', 'moderators.[]')
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

    @task({ withTestWaiter: true, on: 'didReceiveAttrs' })
    loadModerators = task(function *(this: ModeratorManager) {
        try {
            this.moderators = yield this.provider.moderators;
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    });

    @task({ withTestWaiter: true, enqueue: true })
    updateModeratorPermission =
    task(function *(this: ModeratorManager, moderator: ModeratorModel, newPermission: string) {
        try {
            moderator.set('permissionGroup', newPermission);
            yield moderator.save({
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

    @task({ withTestWaiter: true })
    removeModerator = task(function *(this: ModeratorManager, moderator: ModeratorModel) {
        try {
            yield moderator.destroyRecord({
                adapterOptions: {
                    provider: this.provider,
                },
            });
            moderator.unloadRecord();
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
            throw e;
        }
    });
}
