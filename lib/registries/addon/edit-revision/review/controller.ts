import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { taskFor } from 'ember-concurrency-ts';

import Media from 'ember-responsive';

import { PageManager } from 'ember-osf-web/packages/registration-schema';
import RevisionManager from 'registries/edit-revision/revision-manager';
import RevisionModel from 'ember-osf-web/models/revision';

export default class EditRevisionReview extends Controller {
    @service media!: Media;

    @alias('model.revisionManager') revisionManager?: RevisionManager;
    @alias('revisionManager.pageManagers') pageManagers?: PageManager[];
    @alias('revisionManager.revision') revision?: RevisionModel;

    @not('revision') loading!: boolean;
    @not('media.isDesktop') showMobileView!: boolean;

    @action
    markAndValidatedPages() {
        if (this.revisionManager) {
            this.revisionManager.markAllPagesVisited();
            this.revisionManager.validateAllVisitedPages();
            taskFor(this.revisionManager.saveAllVisitedPages).perform();
        }
    }
}
