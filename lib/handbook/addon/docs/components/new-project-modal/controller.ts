import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import Node from 'ember-osf-web/models/node';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';

export default class TagsWidgetController extends Controller {
    @service currentUser!: CurrentUser;
    @service analytics!: Analytics;

    newNode: Node | null = null;

    @action
    projectCreated() {
        return true;
    }

    @action
    closeModal(reload = false) {
        return reload;
    }
}
