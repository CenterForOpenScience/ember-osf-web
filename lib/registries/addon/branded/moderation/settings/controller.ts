import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import config from 'ember-get-config';
import pathJoin from 'ember-osf-web/utils/path-join';
import { ReviewPermissions } from 'ember-osf-web/models/provider';

export default class BrandedModerationSettingsController extends Controller {
    userSettingsLink = pathJoin(config.OSF.url, 'settings', 'notifications');
    @alias('model.id') providerId?: string;

    get shouldShowBulkUploadWidget() {
        return this.model.permissions.includes(ReviewPermissions.AddModerator);
    }

    @computed('providerId')
    get subscriptionIds() {
        return this.providerId
            ? [
                `${this.providerId}_new_pending_withdraw_requests`,
                `${this.providerId}_new_pending_submissions`,
            ]
            : [];
    }
}
