import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import I18N from 'ember-i18n/services/i18n';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';
import requireAuth from 'ember-osf-web/decorators/require-auth';
import EditController from './controller';

@requireAuth()
export default class GuidEdit extends Route.extend(ConfirmationMixin, {}) {
    @service i18n!: I18N;

    // This tells ember-onbeforeunload what to use as the body for the warning before leaving the page.
    confirmationMessage: string = this.i18n.t('collections.collections_submission.warning_body');

    model(this: GuidEdit) {
        return this.modelFor(this.routeName.replace(/\.\w*$/, ''));
    }

    // This tells ember-onbeforeunload's ConfirmationMixin whether or not to stop transitions
    @computed('controller.{isPageDirty,isCollectedMetadatumDirty}')
    get isPageDirty() {
        const controller = this.controller as EditController;
        return () => controller.isPageDirty || controller.isCollectedMetadatumDirty;
    }
}
