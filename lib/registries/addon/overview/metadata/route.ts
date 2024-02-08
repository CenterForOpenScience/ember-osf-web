import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';

export default class MetadataDetailRoute extends Route {
    @service store!: Store;
    @service router!: RouterService;

    async model() {
        const guidNode = this.modelFor('overview');
        const target = await guidNode.taskInstance;

        const cedarMetadataRecords = await target.queryHasMany('cedarMetadataRecords', {
            // embed: 'template',
            'page[size]': 20,
        });

        for(const cedarMetadataRecord of cedarMetadataRecords) {
            ((await cedarMetadataRecord.template) as CedarMetadataTemplateModel).recordCreated = true;
        }

        return {
            target,
            cedarMetadataRecords,
        };
    }
}
