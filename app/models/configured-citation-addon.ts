import { AsyncBelongsTo, belongsTo } from '@ember-data/model';

import ResourceReferenceModel from 'ember-osf-web/models/resource-reference';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import { ConnectedCitationOperationNames, OperationKwargs } from 'ember-osf-web/models/addon-operation-invocation';
import AuthorizedCitationAccountModel from './authorized-citation-account';
import ExternalCitationServiceModel from './external-citation-service';
import ConfiguredAddonModel from './configured-addon';

export default class ConfiguredCitationAddonModel extends ConfiguredAddonModel {
    @belongsTo('external-citation-service', { inverse: null })
    externalCitationService!: AsyncBelongsTo<ExternalCitationServiceModel> & ExternalCitationServiceModel;

    @belongsTo('authorized-citation-account')
    baseAccount!: AsyncBelongsTo<AuthorizedCitationAccountModel> & AuthorizedCitationAccountModel;

    @belongsTo('resource-reference', { inverse: 'configuredCitationAddons' })
    authorizedResource!: AsyncBelongsTo<ResourceReferenceModel> & ResourceReferenceModel;

    get externalServiceId() {
        return (this as ConfiguredCitationAddonModel).belongsTo('externalCitationService').id();
    }

    @task
    @waitFor
    async getFolderItems(this: ConfiguredAddonModel, kwargs?: OperationKwargs) {
        const operationKwargs = kwargs || {};
        const operationName = operationKwargs.itemId ? ConnectedCitationOperationNames.ListCollectionItems :
            ConnectedCitationOperationNames.ListRootCollections;
        // rename 'itemId' key to 'collectionId'
        delete Object.assign(operationKwargs, { ['collectionId']: operationKwargs['itemId'] })['itemId'];
        // gravyvalet doesn't like 'itemType' as a parameter
        delete operationKwargs.itemType;
        const newInvocation = this.store.createRecord('addon-operation-invocation', {
            operationName,
            operationKwargs,
            thruAccount: this,
        });
        return await newInvocation.save();
    }

    @task
    @waitFor
    async getItemInfo(this: ConfiguredAddonModel, itemId: string) {
        const newInvocation = this.store.createRecord('addon-operation-invocation', {
            operationName: ConnectedCitationOperationNames.GetItemInfo,
            operationKwargs: { itemId },
            thruAddon: this,
        });
        return await newInvocation.save();
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'configured-citation-addon': ConfiguredCitationAddonModel;
    } // eslint-disable-line semi
}
