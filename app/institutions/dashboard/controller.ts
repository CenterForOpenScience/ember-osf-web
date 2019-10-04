import Controller from '@ember/controller';

export default class InstitutionsDashboardController extends Controller {}

declare module '@ember/controller' {
    interface Registry {
        'institutions-dashboard': InstitutionsDashboardController;
    }
}
