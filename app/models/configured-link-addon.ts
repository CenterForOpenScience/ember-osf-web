import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { ConnectedLinkOperationNames, Item, OperationKwargs } from 'ember-osf-web/models/addon-operation-invocation';
import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';

import ExternalLinkServiceModel, { SupportedResourceTypes } from 'ember-osf-web/models/external-link-service';
import AuthorizedLinkAccountModel from 'ember-osf-web/models/authorized-link-account';
import { taskFor } from 'ember-concurrency-ts';
import ConfiguredAddonModel from './configured-addon';


export default class ConfiguredLinkAddonModel extends ConfiguredAddonModel {
    @attr('string') targetId!: string;
    @attr('string') targetUrl!: string;
    @attr('string') resourceType!: SupportedResourceTypes;

    @belongsTo('external-link-service', { inverse: null })
    externalLinkService!: AsyncBelongsTo<ExternalLinkServiceModel> & ExternalLinkServiceModel;

    @belongsTo('authorized-link-account')
    baseAccount!: AsyncBelongsTo<AuthorizedLinkAccountModel> & AuthorizedLinkAccountModel;

    @belongsTo('resource-reference', { inverse: 'configuredLinkAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;

    get externalServiceId() {
        return (this as ConfiguredLinkAddonModel).belongsTo('externalLinkService').id();
    }

    get hasRootFolder() {
        return false;
    }

    @task
    @waitFor
    async getFolderItems(this: ConfiguredAddonModel, kwargs?: OperationKwargs) {
        const operationKwargs = kwargs || {};
        const operationName = operationKwargs.itemId ? ConnectedLinkOperationNames.ListChildItems :
            ConnectedLinkOperationNames.ListRootItems;
        const newInvocation = this.store.createRecord('addon-operation-invocation', {
            operationName,
            operationKwargs,
            thruAddon: this,
        });
        return await newInvocation.save();
    }

    @task
    @waitFor
    async getItemInfo(this: ConfiguredAddonModel, itemId: string) {
        const newInvocation = this.store.createRecord('addon-operation-invocation', {
            operationName: ConnectedLinkOperationNames.GetItemInfo,
            operationKwargs: { itemId },
            thruAddon: this,
        });
        return await newInvocation.save();
    }

    @task
    @waitFor
    async getSelectedItemName(this: ConfiguredLinkAddonModel) {
        const response = await taskFor(this.getItemInfo).perform(this.targetId);
        this.targetItemName = (response.operationResult as Item).itemName;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-link-addon': ConfiguredLinkAddonModel;
    } // eslint-disable-line semi
}
