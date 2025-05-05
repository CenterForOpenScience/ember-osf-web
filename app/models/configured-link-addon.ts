import { AsyncBelongsTo, attr, belongsTo } from '@ember-data/model';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { ConnectedLinkOperationNames, OperationKwargs } from 'ember-osf-web/models/addon-operation-invocation';
import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';

import ExternalLinkServiceModel from 'ember-osf-web/models/external-link-service';
import AuthorizedLinkAccountModel from 'ember-osf-web/models/authorized-link-account';
import ConfiguredAddonModel from './configured-addon';


export default class ConfiguredLinkAddonModel extends ConfiguredAddonModel {
    @attr('number') concurrentUploads!: number;

    @belongsTo('external-link-service', { inverse: null })
    externalLinkService!: AsyncBelongsTo<ExternalLinkServiceModel> & ExternalLinkServiceModel;

    @belongsTo('authorized-storage-account')
    baseAccount!: AsyncBelongsTo<AuthorizedLinkAccountModel> & AuthorizedLinkAccountModel;

    @belongsTo('resource-reference', { inverse: 'configuredLinkAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;

    get externalServiceId() {
        return (this as ConfiguredLinkAddonModel).belongsTo('externalLinkService').id();
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
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-link-addon': ConfiguredLinkAddonModel;
    } // eslint-disable-line semi
}
