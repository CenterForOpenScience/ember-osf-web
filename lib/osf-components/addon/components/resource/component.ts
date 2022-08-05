import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';

import { ResourceTypes } from 'ember-osf-web/models/resource';
import { getBadgeIcon, getBadgeIconDisabled } from 'ember-osf-web/helpers/open-badges-icon-map';
import Toast from 'ember-toastr/services/toast';
import RegistrationModel from 'ember-osf-web/models/registration';

interface ResourceArgs {
    registration: RegistrationModel;
    resourceType: ResourceTypes;
    hasResource: boolean;
}

export default class ResourceComponent extends Component<ResourceArgs> {
    @service intl!: Intl;
    @service toast!: Toast;

    constructor(owner: unknown, args: ResourceArgs) {
        super(owner, args);
    }

    get getSrc() {
        if (!this.args.resourceType) {
            return '';
        }

        try {
            if (this.args.hasResource === true) {
                return getBadgeIcon(this.args.resourceType);
            } else {
                return getBadgeIconDisabled(this.args.resourceType);
            }
        } catch (e) {
            return this.toast.error(this.intl.t('registries.overview.resources.' + this.args.resourceType + '.error'));
        }
    }
}
