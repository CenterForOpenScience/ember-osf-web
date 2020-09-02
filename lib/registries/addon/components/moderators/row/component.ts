import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

import { layout } from 'ember-osf-web/decorators/component';
import ModeratorModel from 'ember-osf-web/models/moderator';
import CurrentUserService from 'ember-osf-web/services/current-user';
import template from './template';

@tagName('')
@layout(template)
export default class ModeratorRow extends Component {
    @service currentUser!: CurrentUserService;
    moderator!: ModeratorModel;
    currentUserIsProviderAdmin!: boolean;
    permissionOptions = ['Moderator', 'Admin']; // TODO: import the enum on the moderator model (coming soon)

    @computed('currentUser.currentUserId', 'moderator')
    get moderatorIsCurrentUser(): boolean {
        return this.moderator && (this.moderator.id === this.currentUser.currentUserId);
    }

    @computed('moderatorIsCurrentUser', 'currentUserIsProviderAdmin')
    get shouldShowRemove(): boolean {
        return this.moderatorIsCurrentUser || this.currentUserIsProviderAdmin;
    }
}
