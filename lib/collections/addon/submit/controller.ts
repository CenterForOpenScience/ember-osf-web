import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';

import CollectionSubmission from 'ember-osf-web/models/collection-submission';
import Collection from 'ember-osf-web/models/collection';
import CollectionProvider from 'ember-osf-web/models/collection-provider';

export default class Submit extends Controller {
    @alias('model.taskInstance.value.provider') provider!: CollectionProvider;
    @alias('model.taskInstance.value.collection') collection!: Collection;
    @alias('model.taskInstance.value.collectionSubmission') collectionSubmission!: CollectionSubmission;

    isPageDirty = false;

    @action
    returnToDiscoverPage() {
        this.transitionToRoute('provider.discover', this.provider.id);
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
