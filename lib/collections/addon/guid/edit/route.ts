import { computed } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

// eslint-disable-next-line ember/no-mixins
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';

import requireAuth from 'ember-osf-web/decorators/require-auth';

import EditController from './controller';

@requireAuth()
export default class GuidEdit extends Route.extend(ConfirmationMixin, {}) {
    @service intl!: Intl;

    // This tells ember-onbeforeunload what to use as the body for the warning before leaving the page.
    confirmationMessage = this.intl.t('collections.collections_submission.warning_body');

    model() {
        return this.modelFor(this.routeName.replace(/\.\w*$/, ''));
    }

    // This tells ember-onbeforeunload's ConfirmationMixin whether or not to stop transitions
    @computed('controller.{isPageDirty,isCollectedMetadatumDirty}')
    get isPageDirty() {
        const controller = this.controller as EditController;
        return () => controller.isPageDirty || controller.isCollectedMetadatumDirty;
    }
}
