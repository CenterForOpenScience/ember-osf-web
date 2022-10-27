import Store from '@ember-data/store';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { enqueueTask, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import ModeratorModel, { PermissionGroup } from 'ember-osf-web/models/moderator';
import ProviderModel from 'ember-osf-web/models/provider';
import UserModel from 'ember-osf-web/models/user';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import template from './template';

export interface ModeratorManager {
    moderators: ModeratorModel[];
    permissionOptions: PermissionGroup;
    provider: ProviderModel;
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
    @service store!: Store;
    @service toast!: Toast;
    @service intl!: Intl;

    provider!: ProviderModel;
    permissionOptions = Object.values(PermissionGroup);
    reloadModeratorList?: () => void;

    @tracked currentModerator?: ModeratorModel;

    @computed('currentModerator.permissionGroup', 'currentUser.currentUserId')
    get currentUserIsProviderAdmin(): boolean {
        if (this.currentUser && this.currentModerator) {
            return this.currentModerator.permissionGroup === PermissionGroup.Admin;
        }
        return false;
    }

    @enqueueTask
    @waitFor
    async updateModeratorPermission(moderator: ModeratorModel, newPermission: string) {
        try {
            moderator.set('permissionGroup', newPermission);
            await moderator.save();
            this.toast.success(this.intl.t(
                'osf-components.moderators.updatedModeratorPermissionSuccess',
                { userName: moderator.fullName, permission: newPermission },
            ));
        } catch (e) {
            const errorMessage = this.intl.t(
                'osf-components.moderators.updatedModeratorPermissionError',
                { permission: newPermission },
            );
            moderator.rollbackAttributes();
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    @task
    @waitFor
    async removeModeratorTask(moderator: ModeratorModel) {
        try {
            await moderator.destroyRecord();

            this.toast.success(this.intl.t(
                'osf-components.moderators.removedModeratorSuccess',
                { userName: moderator.fullName },
            ));
        } catch (e) {
            const errorMessage = this.intl.t(
                'osf-components.moderators.removedModeratorError',
                { permission: moderator.permissionGroup },
            );
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        } finally {
            if (this.reloadModeratorList) {
                this.reloadModeratorList();
            }
        }
    }

    @task({ on: 'init' })
    @waitFor
    async loadCurrentModerator() {
        try {
            if (this.currentUser.currentUserId) {
                this.currentModerator = await this.store.findRecord('moderator', this.currentUser.currentUserId,
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
    }

    @enqueueTask
    @waitFor
    async addUserAsModerator(user: UserModel, permissionGroup: PermissionGroup) {
        let newModerator;
        try {
            if (user && permissionGroup) {
                newModerator = this.store.createRecord('moderator', {
                    id: user.id,
                    provider: this.provider,
                    permissionGroup,
                });
                await newModerator.save();
                if (this.reloadModeratorList) {
                    this.reloadModeratorList();
                }
                this.toast.success(this.intl.t(
                    'osf-components.moderators.addedNewModeratorSuccess',
                    { userName: user.fullName, permission: permissionGroup },
                ));
            }
        } catch (e) {
            if (newModerator) {
                newModerator.unloadRecord();
            }
            const errorMessage = this.intl.t(
                'osf-components.moderators.addedNewModeratorError',
                { permission: permissionGroup },
            );
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    @enqueueTask
    @waitFor
    async addEmailAsModerator(fullName: string, email: string, permissionGroup: PermissionGroup) {
        let newModerator;
        try {
            if (fullName && email && permissionGroup) {
                newModerator = this.store.createRecord('moderator', {
                    provider: this.provider,
                    fullName,
                    email,
                    permissionGroup,
                });
                await newModerator.save();
                if (this.reloadModeratorList) {
                    this.reloadModeratorList();
                }
                this.toast.success(this.intl.t(
                    'osf-components.moderators.addedNewModeratorSuccess',
                    { userName: fullName, permission: permissionGroup },
                ));
            }
        } catch (e) {
            if (newModerator) {
                newModerator.unloadRecord();
            }
            const errorMessage = this.intl.t(
                'osf-components.moderators.addedNewModeratorError',
                { permission: permissionGroup },
            );
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    @action
    removeModerator(moderator: ModeratorModel) {
        taskFor(this.removeModeratorTask).perform(moderator);
    }
}
