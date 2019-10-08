import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';

import I18N from 'ember-i18n/services/i18n';
import Media from 'ember-responsive';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import CurrentUser from 'ember-osf-web/services/current-user';

export default class DraftsForm extends Controller {
    @service media!: Media;
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service router!: RouterService;

    queryParams = ['page'];
    page = 1;

    @alias('model')
    draftRegistration!: DraftRegistration;

    @alias('router.currentRouteName')
    formRoute!: string;

    @alias('page')
    currentPage!: number;

    @computed('page')
    get nextPageParams() {
        return {
            page: this.page + 1,
        };
    }

    @computed('page')
    get prevPageParams() {
        return {
            page: this.page - 1,
        };
    }
}

declare module '@ember/controller' {
    interface Registry {
        draftsForm: DraftsForm;
    }
}
