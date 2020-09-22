import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
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

    provider!: RegistrationProviderModel;
    permissionOptions = Object.values(PermissionGroup);
    reloadModeratorList?: () => void;

    @tracked self?: ModeratorModel;

    @computed('currentUser.currentUserId', 'self')
    get currentUserIsProviderAdmin(): boolean {
        if (this.currentUser && this.self) {
            return this.self.permissionGroup === PermissionGroup.Admin;
        }
        return false;
    }

    @task({ withTestWaiter: true, on: 'init' })
    loadSelf =
    task(function *(this: ModeratorManagerComponent) {
        try {
            if (this.currentUser.currentUserId) {
                this.self = yield this.store.findRecord('moderator', this.currentUser.currentUserId,
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
        try {
            if (user && permissionGroup) {
                const newModerator = this.store.createRecord('moderator', {
                    id: user.id,
                    provider: this.provider,
                    permissionGroup,
                });
                yield newModerator.save();
                if (this.reloadModeratorList) {
                    this.reloadModeratorList();
                }
            }
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
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
        try {
            if (fullName && email && permissionGroup) {
                const newModerator = this.store.createRecord('moderator', {
                    provider: this.provider,
                    fullName,
                    email,
                    permissionGroup,
                });
                yield newModerator.save();
                if (this.reloadModeratorList) {
                    this.reloadModeratorList();
                }
            }
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    });

    @task({ withTestWaiter: true, enqueue: true })
    updateModeratorPermission =
    task(function *(this: ModeratorManagerComponent, moderator: ModeratorModel, newPermission: string) {
        try {
            moderator.set('permissionGroup', newPermission);
            yield moderator.save();
        } catch (e) {
            moderator.rollbackAttributes();
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    });

    @task({ withTestWaiter: true })
    removeModerator = task(function *(this: ModeratorManagerComponent, moderator: ModeratorModel) {
        try {
            yield moderator.destroyRecord();
            if (this.reloadModeratorList) {
                this.reloadModeratorList();
            }
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    });
}
