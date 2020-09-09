import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import { layout } from 'ember-osf-web/decorators/component';
import ModeratorModel, { PermissionGroup } from 'ember-osf-web/models/moderator';
import CurrentUserService from 'ember-osf-web/services/current-user';
import { ModeratorManager } from '../manager/component';
import template from './template';

@tagName('')
@layout(template)
export default class ModeratorRow extends Component {
    @service currentUser!: CurrentUserService;
    manager!: ModeratorManager;
    moderator!: ModeratorModel;
    permissionOptions = Object.values(PermissionGroup);
    @alias('manager.currentUserIsProviderAdmin') currentUserIsProviderAdmin!: boolean;

    @computed('currentUser.currentUserId', 'moderator.user')
    get moderatorIsCurrentUser(): boolean {
        if (this.moderator) {
            const moderatorUserId = this.moderator.belongsTo('user').id();
            return moderatorUserId === this.currentUser.currentUserId;
        }
        return false;
    }

    @computed('moderatorIsCurrentUser', 'currentUserIsProviderAdmin')
    get shouldShowRemove(): boolean {
        return this.currentUserIsProviderAdmin || this.moderatorIsCurrentUser;
    }
}
