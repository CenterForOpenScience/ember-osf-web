import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';
import { getBadgeIcon } from 'ember-osf-web/helpers/open-badges-icon-map';

import ResourceModel from 'ember-osf-web/models/resource';

interface ResourseCardArgs {
    resource: ResourceModel;
}

export default class ResourceCardComponent extends Component<ResourseCardArgs> {
    @service intl!: Intl;

    get resourceTypeName() {
        const { resourceType } = this.args.resource;
        return this.intl.t('osf-components.resources-list.' + resourceType);
    }

    get resourceIcon() {
        // don't splice resourceType into the icon file name to account for fingerprinting
        const { resourceType } = this.args.resource;
        return getBadgeIcon(resourceType);
    }
}
