import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Controller from '@ember/controller';
import config from 'ember-get-config';
import CollectedMetadatum from 'ember-osf-web/models/collected-metadatum';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';
import Node from 'ember-osf-web/models/node';

export default class GuidEdit extends Controller {
    @alias('model.taskInstance.value.provider') provider!: CollectionProvider;
    @alias('model.taskInstance.value.collection') collection!: Collection;
    @alias('model.taskInstance.value.collectedMetadatum') collectedMetadatum!: CollectedMetadatum;
    @alias('model.taskInstance.value.collectionItem') collectionItem!: Node;

    isPageDirty: boolean = false;

    @computed('this.collectedMetadatum.hasDirtyAttributes')
    get isCollectedMetadatumDirty() {
        return this.collectedMetadatum.hasDirtyAttributes;
    }

    @action
    returnToProjectOverviewPage() {
        // change to using `transitionToRoute()` once the project overview page is in Ember
        window.location.href = `${config.OSF.url}${this.collectionItem.id}`;
    }

    @action
    setPageDirty() {
        this.set('isPageDirty', true);
    }

    @action
    resetPageDirty() {
        this.set('isPageDirty', false);
    }
}
