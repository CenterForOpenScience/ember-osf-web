import Component from '@glimmer/component';
import { getBadgeIcon, getBadgeIconDisabled } from 'ember-osf-web/helpers/open-badges-icon-map';

import { ResourceTypes } from 'ember-osf-web/models/resource';

interface OpenBadgeCardArgs {
    resourceType: ResourceTypes;
}

export default class OpenBadgeCardComponent extends Component<OpenBadgeCardArgs> {
    get resourceIcon() {
        // don't splice resourceType into the icon file name to account for fingerprinting
        const resourceType = this.args.resourceType;
        return getBadgeIcon(resourceType);
    }

    get resourceIconDisabled() {
        // don't splice resourceType into the icon file name to account for fingerprinting
        const resourceType = this.args.resourceType;
        return getBadgeIconDisabled(resourceType);
    }
}
