import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';

import { layout } from 'ember-osf-web/decorators/component';
import ModeratorModel from 'ember-osf-web/models/moderator';
import ProviderModel from 'ember-osf-web/models/provider';
import CurrentUserService from 'ember-osf-web/services/current-user';
import template from './template';

@tagName('')
@layout(template)
export default class ModeratorList extends Component {
    @service currentUser!: CurrentUserService;
    moderators!: ModeratorModel[];
    provider!: ProviderModel;

    @computed('currentUser')
    get currentUserIsProviderAdmin(): boolean {
        if (this.currentUser) {
            const moderator = this.moderators.findBy('id', this.currentUser.currentUserId);
            return moderator!.permissionGroup === 'admin';
        }
        return false;
    }
    // TODO: Functionaity to adjust permissions (admins)
    // TODO: Functionality to remove self (moderators)
    // TODO: Functionality to add/remove others (admins)
    @action
    removeModerator(moderator: ModeratorModel) {
        this.moderators.removeObject(moderator);
    }
}
