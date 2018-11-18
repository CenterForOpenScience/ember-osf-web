import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';

import User from 'ember-osf-web/models/user';
import CurrentUser from 'ember-osf-web/services/current-user';

// Note: This is used wholesale by all the child routes since the functionality
// is common to each of them.

export default abstract class SettingsProfileRoute extends Route.extend(ConfirmationMixin, {}) {
    @service currentUser!: CurrentUser;

    @alias('currentUser.user') user!: User;

    @computed('user', 'user.hasDirtyAttributes')
    get isPageDirty() {
        const value = this.user.hasDirtyAttributes;
        return () => value;
    }
}
