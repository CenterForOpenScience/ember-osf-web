import Route from '@ember/routing/route';
import { AddonModelShape } from '../route';

export default class GuidNodeAddonsAddonAccount extends Route {
    async afterModel(model: AddonModelShape) {
        const provider = await model.taskInstance;
        if (!provider.hasAcceptedTerms) {
            this.transitionTo('guid-node.addons.addon.terms');
        } else if (provider.isConfigured) {
            this.transitionTo('guid-node.addons.addon.configure');
        }
    }
}
