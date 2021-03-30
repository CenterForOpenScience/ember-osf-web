import Route from '@ember/routing/route';
import SettingsApplicationCreateController from './controller';

export default class SettingsDeveloperAppsCreateRoute extends Route {
    setupController(controller: SettingsApplicationCreateController) {
        controller.set('developerApp', this.store.createRecord('developer-app'));
    }
}
