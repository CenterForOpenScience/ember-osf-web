import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';

import ResourceModel from 'ember-osf-web/models/resource';
import { getBadgeIcon, getBadgeIconDisabled } from 'ember-osf-web/helpers/open-badges-icon-map';

interface ResourceArgs {
    resource: ResourceModel;
}

export default class ResourceComponent extends Component<ResourceArgs> {
    @service intl!: Intl;

    constructor(owner: unknown, args: ResourceArgs) {
        super(owner, args);
    }

    get getSrc() {
        if (!this.args.resource) {
            return '';
        }
        const resourceType = this.args.resource.resourceType;
        const isFinal = this.args.resource.finalized;

        if (!isFinal) {
            return getBadgeIconDisabled(resourceType);
        } else if (isFinal) {
            return getBadgeIcon(resourceType);
        } else {
            return new Error('Badge state nebulous.');
        }
    }
}
