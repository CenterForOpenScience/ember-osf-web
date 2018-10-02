import { match } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { Registry as Services } from '@ember/service';
import Theme from 'ember-osf-web/services/theme';

export default class Application extends Controller {
    @service router!: Services['router'];
    @service theme!: Theme;

    // This is a hack until we move the main application into it's own engine.
    // Then each engine will be in charge of rendering/customizing the header.
    // Feel free to move it over, any time. Just go for it. We'll love you. I promise.
    @match('router.currentRouteName', /^handbook|^registries/) disableHeader!: boolean;
}

declare module '@ember/controller' {
    interface Registry {
        application: Application;
    }
}
