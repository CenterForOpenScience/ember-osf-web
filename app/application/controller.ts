import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import Theme from 'ember-osf-web/services/theme';

export default class Application extends Controller {
    @service theme!: Theme;
}

declare module '@ember/controller' {
    interface Registry {
        application: Application;
    }
}
