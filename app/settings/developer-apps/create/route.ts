import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import SettingsApplicationCreateController from './controller';

export default class SettingsDeveloperAppsCreateRoute extends Route {
    @service store!: Store;

    setupController(controller: SettingsApplicationCreateController) {
        controller.set('developerApp', this.store.createRecord('developer-app'));
    }
}
