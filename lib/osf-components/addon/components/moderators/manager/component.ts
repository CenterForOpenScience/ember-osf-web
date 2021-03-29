import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import ModeratorModel, { PermissionGroup } from 'ember-osf-web/models/moderator';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import UserModel from 'ember-osf-web/models/user';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import template from './template';

export interface ModeratorManager {
    moderators: ModeratorModel[];
    permissionOptions: PermissionGroup;
    provider: RegistrationProviderModel;
    currentUserIsProviderAdmin: boolean;
    addUserAsModerator: (user: UserModel, permissionGroup: PermissionGroup) => void;
    addEmailAsModerator: (name: string, email: string, permissionGroup: PermissionGroup) => void;
    reloadModeratorList?: () => void;
    updateModeratorPermission?: () => void;
    removeModerator?: () => void;
}

@tagName('')
@layout(template)
export default class ModeratorManagerComponent extends Component {
    @service currentUser!: CurrentUserService;
    @service store!: DS.Store;
    @service toast!: Toast;
    @service intl!: Intl;

    provider!: RegistrationProviderModel;
    permissionOptions = Object.values(PermissionGroup);
    reloadModeratorList?: () => void;

    @tracked currentModerator?: ModeratorModel;

    @computed('currentUser.currentUserId', 'currentModerator')
    get currentUserIsProviderAdmin(): boolean {
        if (this.currentUser && this.currentModerator) {
            return this.currentModerator.permissionGroup === PermissionGroup.Admin;
        }
        return false;
    }

    @task({ withTestWaiter: true, on: 'init' })
    loadCurrentModerator =
    task(function *(this: ModeratorManagerComponent) {
        try {
            if (this.currentUser.currentUserId) {
                this.currentModerator = yield this.store.findRecord('moderator', this.currentUser.currentUserId,
                    {
                        adapterOptions: {
                            providerId: this.provider.id,
                        },
                    });
            }
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    });

    @task({ withTestWaiter: true, enqueue: true })
    addUserAsModerator =
    task(function *(this: ModeratorManagerComponent, user: UserModel, permissionGroup: PermissionGroup) {
        let newModerator;
        try {
            if (user && permissionGroup) {
                newModerator = this.store.createRecord('moderator', {
                    id: user.id,
                    provider: this.provider,
                    permissionGroup,
                });
                yield newModerator.save();
                if (this.reloadModeratorList) {
                    this.reloadModeratorList();
                }
                this.toast.success(this.intl.t(
                    'registries.moderation.moderators.addedNewModeratorSuccess',
                    { userName: user.fullName, permission: permissionGroup },
                ));
            }
        } catch (e) {
            if (newModerator) {
                newModerator.unloadRecord();
            }
            const errorMessage = this.intl.t(
                'registries.moderation.moderators.addedNewModeratorError',
                { permission: permissionGroup },
            );
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    });

    @task({ withTestWaiter: true, enqueue: true })
    addEmailAsModerator =
    task(function *(
        this: ModeratorManagerComponent,
        fullName: string,
        email: string,
        permissionGroup: PermissionGroup,
    ) {
        let newModerator;
        try {
            if (fullName && email && permissionGroup) {
                newModerator = this.store.createRecord('moderator', {
                    provider: this.provider,
                    fullName,
                    email,
                    permissionGroup,
                });
                yield newModerator.save();
                if (this.reloadModeratorList) {
                    this.reloadModeratorList();
                }
                this.toast.success(this.intl.t(
                    'registries.moderation.moderators.addedNewModeratorSuccess',
                    { userName: fullName, permission: permissionGroup },
                ));
            }
        } catch (e) {
            if (newModerator) {
                newModerator.unloadRecord();
            }
            const errorMessage = this.intl.t(
                'registries.moderation.moderators.addedNewModeratorError',
                { permission: permissionGroup },
            );
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    });

    @task({ withTestWaiter: true, enqueue: true })
    updateModeratorPermission =
    task(function *(this: ModeratorManagerComponent, moderator: ModeratorModel, newPermission: string) {
        try {
            moderator.set('permissionGroup', newPermission);
            yield moderator.save();
            this.toast.success(this.intl.t(
                'registries.moderation.moderators.updatedModeratorPermissionSuccess',
                { userName: moderator.fullName, permission: newPermission },
            ));
        } catch (e) {
            const errorMessage = this.intl.t(
                'registries.moderation.moderators.updatedModeratorPermissionError',
                { permission: newPermission },
            );
            moderator.rollbackAttributes();
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    });

    @task({ withTestWaiter: true })
    removeModeratorTask = task(function *(this: ModeratorManagerComponent, moderator: ModeratorModel) {
        try {
            yield moderator.destroyRecord();

            this.toast.success(this.intl.t(
                'registries.moderation.moderators.removedModeratorSuccess',
                { userName: moderator.fullName },
            ));
        } catch (e) {
            const errorMessage = this.intl.t(
                'registries.moderation.moderators.removedModeratorError',
                { permission: moderator.permissionGroup },
            );
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        } finally {
            if (this.reloadModeratorList) {
                this.reloadModeratorList();
            }
        }
    });

    @action
    removeModerator(moderator: ModeratorModel) {
        this.removeModeratorTask.perform(moderator);
    }
}
