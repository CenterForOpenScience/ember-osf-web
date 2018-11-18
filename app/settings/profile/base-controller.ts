import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';

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
