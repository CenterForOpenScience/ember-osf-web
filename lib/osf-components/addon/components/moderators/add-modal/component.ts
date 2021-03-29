import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { ValidationObject } from 'ember-changeset-validations';
import { validateFormat, validatePresence } from 'ember-changeset-validations/validators';
import { task, timeout } from 'ember-concurrency';
import DS from 'ember-data';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import { PermissionGroup } from 'ember-osf-web/models/moderator';
import UserModel from 'ember-osf-web/models/user';
import CurrentUserService from 'ember-osf-web/services/current-user';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import { ModeratorManager } from '../manager/component';
import template from './template';

interface InviteFormFields {
    email: string;
    fullName: string;
    permissionGroup: PermissionGroup;
}

interface UserFormFields {
    user: UserModel;
    permissionGroup: PermissionGroup;
}

const InviteFormValidations: ValidationObject<InviteFormFields> = {
    email: [
        validatePresence({
            presence: true,
            type: 'empty',
        }),
        validateFormat({
            type: 'email',
            translationArgs: { description: 'This field' },
        }),
    ],
    fullName: validatePresence({
        presence: true,
        type: 'empty',
    }),
    permissionGroup: validatePresence({
        presence: true,
        type: 'empty',
    }),
};

const UserFormValidations: ValidationObject<UserFormFields> = {
    user: validatePresence({
        presence: true,
        type: 'empty',
    }),
    permissionGroup: validatePresence({
        presence: true,
        type: 'empty',
    }),
};

@tagName('')
@layout(template)
export default class AddModalComponent extends Component {
    @service currentUser!: CurrentUserService;
    @service toast!: Toast;
    @service store!: DS.Store;

    manager!: ModeratorManager;
    @tracked shouldOpenAddDialog = false;

    permissionOptions = [
        PermissionGroup.Moderator,
        PermissionGroup.Admin,
    ];

    inviteChangeset = buildChangeset({
        fullName: null,
        email: null,
        permissionGroup: PermissionGroup.Moderator,
    }, InviteFormValidations);

    userChangeset = buildChangeset({
        user: null,
        permissionGroup: PermissionGroup.Moderator,
    }, UserFormValidations);

    @task({ withTestWaiter: true, restartable: true })
    searchUser =
    task(function *(this: AddModalComponent, name: string) {
        try {
            yield timeout(500);
            return yield this.store.query('user', {
                'filter[full_name]': name,
            });
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
            return null;
        }
    });

    @action
    addUser() {
        this.userChangeset.validate();
        this.inviteChangeset.validate();
        if (this.userChangeset.isValid && this.userChangeset.changes) {
            this.manager.addUserAsModerator(
                this.userChangeset.get('user'),
                this.userChangeset.get('permissionGroup'),
            );
            this.closeAddModeratorDialog();
        }
        if (this.inviteChangeset.isValid && this.inviteChangeset.changes) {
            this.manager.addEmailAsModerator(
                this.inviteChangeset.get('fullName'),
                this.inviteChangeset.get('email'),
                this.inviteChangeset.get('permissionGroup'),
            );
            this.closeAddModeratorDialog();
        }
    }

    @action
    openAddModeratorDialog() {
        this.shouldOpenAddDialog = true;
    }

    @action
    closeAddModeratorDialog() {
        this.shouldOpenAddDialog = false;
        this.userChangeset.rollback();
        this.inviteChangeset.rollback();
    }

    @action
    didToggle() {
        this.userChangeset.rollback();
        this.inviteChangeset.rollback();
    }
}
