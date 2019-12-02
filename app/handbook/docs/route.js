import Route from '@ember/routing/route';
import config from 'handbook/config/environment';

export default class DocsRoute extends Route {
    model() {
        if (config.docGenerationEnabled) {
            return this.store.findRecord('project', 'osf-components');
        }
        return undefined;
    }
}
