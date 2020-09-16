import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import { layout } from 'ember-osf-web/decorators/component';
import UserModel from 'ember-osf-web/models/user';
import CurrentUserService from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import Toast from 'ember-toastr/services/toast';
import { ModeratorManager } from '../manager/component';
import template from './template';

@tagName('')
@layout(template)
export default class ModeratorList extends Component {
    @service currentUser!: CurrentUserService;
    @service toast!: Toast;
    @service store!: DS.Store;

    manager!: ModeratorManager;
    @tracked shouldOpenAddDialog = false;
    @tracked userToAdd?: UserModel | null;

    @task({ withTestWaiter: true, restartable: true })
    searchUser =
    task(function *(this: ModeratorList, name: string) {
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

    @action
    addUser(user: UserModel) {
        this.manager.addUserAsModerator(user);
        this.closeAddModeratorDialog();
    }

    @action
    onChange(user: UserModel) {
        this.userToAdd = user;
    }

    @action
    openAddModeratorDialog() {
        this.shouldOpenAddDialog = true;
    }

    @action
    closeAddModeratorDialog() {
        this.shouldOpenAddDialog = false;
        this.userToAdd = null;
    }
}
