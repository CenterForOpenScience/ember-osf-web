import Route from '@ember/routing/route';
import Store from '@ember-data/store';
import { inject as service } from '@ember/service';

export default class GuidNodeLinks extends Route {
    @service store!: Store;

    async model() {
        const node = await this.modelFor('guid-node').taskInstance;
        const resourceReferences = await this.store.query('resource-reference', {
            filter: {resource_uri: node.links.iri?.toString()},
        });
        const resourceReference = resourceReferences?.firstObject;
        const configuredLinkAddons = await resourceReference?.configuredLinkAddons;
        return await {node, configuredLinkAddons};
    }
}
