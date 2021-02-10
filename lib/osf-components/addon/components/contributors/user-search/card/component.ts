import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Permission } from 'ember-osf-web/models/osf-model';
import UserModel from 'ember-osf-web/models/user';
import ContributorsManager from 'osf-components/components/contributors/manager/component';

interface UserSearchCardComponentArguments {
    manager: ContributorsManager;
    user: UserModel;
}

export default class UserSearchCardComponent extends Component<UserSearchCardComponentArguments> {
    @tracked permission = Permission.Write;
    @tracked isBibliographic = true;

    permissionOptions = Object.values(Permission);

    get isAdded() {
        const addedContributorsId = this.args.manager.contributors.map(item => item.users.get('id'));
        return addedContributorsId.includes(this.args.user.id);
    }

    @action
    updatePermission(permission: Permission) {
        this.permission = permission;
    }

    @action
    toggleIsBibliographic() {
        this.isBibliographic = !this.isBibliographic;
    }
}
