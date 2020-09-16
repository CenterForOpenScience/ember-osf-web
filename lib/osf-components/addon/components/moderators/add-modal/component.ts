import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { ValidationObject } from 'ember-changeset-validations';
import { validateFormat, validatePresence } from 'ember-changeset-validations/validators';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import { layout } from 'ember-osf-web/decorators/component';
import UserModel from 'ember-osf-web/models/user';
import CurrentUserService from 'ember-osf-web/services/current-user';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import Toast from 'ember-toastr/services/toast';
import { ModeratorManager } from '../manager/component';
import template from './template';

interface InviteFormFields {
    email: string;
    fullName: string;
}

interface UserFormFields {
    user: UserModel;
}

const InviteFormValidations: ValidationObject<InviteFormFields> = {
    email: [
        validatePresence({ presence: true, type: 'empty' }),
        validateFormat({ type: 'email', translationArgs: { description: 'This field' } }),
    ],
    fullName: validatePresence({ presence: true, type: 'empty' }),
};

const UserFormValidations: ValidationObject<UserFormFields> = {
    user: validatePresence({ presence: true, type: 'empty' }),
};

@tagName('')
@layout(template)
export default class AddModalComponent extends Component {
    @service currentUser!: CurrentUserService;
    @service toast!: Toast;
    @service store!: DS.Store;

    manager!: ModeratorManager;
    @tracked shouldOpenAddDialog = false;

    inviteChangeset = buildChangeset({
        fullName: null,
        email: null,
    }, InviteFormValidations);

    userChangeset = buildChangeset({
        user: null,
    }, UserFormValidations);

    @task({ withTestWaiter: true, restartable: true })
    searchUser =
    task(function *(this: AddModalComponent, name: string) {
        try {
            yield timeout(500);
            return yield this.store.query('user', {
                'filter[fullName]': name,
            });
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
            return null;
        }
    });

    @and('userChangeset.isDirty', 'userChangeset.isValid')
    userChangesetIsValid!: boolean;

    @and('inviteChangeset.isDirty', 'inviteChangeset.isValid')
    inviteChangesetIsValid!: boolean;

    @action
    addUser() {
        if (this.userChangesetIsValid) {
            this.manager.addUserAsModerator(this.userChangeset.get('user'));
        }
        if (this.inviteChangesetIsValid) {
            this.manager.addEmailAsModerator(
                this.inviteChangeset.get('fullName'),
                this.inviteChangeset.get('email'),
            );
        }
        this.closeAddModeratorDialog();
    }

    @action
    onChange(user: UserModel) {
        this.userChangeset.set('user', user);
    }

    @action
    openAddModeratorDialog() {
        this.shouldOpenAddDialog = true;
    }

    @action
    closeAddModeratorDialog() {
        this.shouldOpenAddDialog = false;
        this.userChangeset.set('user', null);
        this.inviteChangeset.set('email', null);
        this.inviteChangeset.set('fullName', null);
    }

    @action
    didToggle() {
        this.userChangeset.set('user', null);
        this.inviteChangeset.set('email', null);
        this.inviteChangeset.set('fullName', null);
    }
}
