import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import User from 'ember-osf-web/models/user';
import CurrentUser from 'ember-osf-web/services/current-user';

// Note: This is used wholesale by all the child routes since the functionality
// is common to each of them.

export default abstract class SettingsProfileController extends Controller {
    @service currentUser!: CurrentUser;

    @alias('currentUser.user') user!: User;

    @action
    onSave() {
        this.user.save();
    }

    @action
    onWillDestroy(user: User) {
        user.rollbackAttributes();
    }
}
