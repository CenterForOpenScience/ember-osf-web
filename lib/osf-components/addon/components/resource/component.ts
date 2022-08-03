import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';

import ResourceModel from 'ember-osf-web/models/resource';

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
        let source: string;

        switch (resourceType) {
        case 'data':
            if (isFinal) {
                source = '/assets/images/badges/data_small_color.png';
            } else {
                source = '/assets/images/badges/data_small_gray.png';
            }
            break;
        case 'materials':
            if (isFinal) {
                source = '/assets/images/badges/materials_small_color.png';
            } else {
                source = '/assets/images/badges/materials_small_gray.png';
            }
            break;
        case 'analytic_code':
            if (isFinal) {
                source = '/assets/images/badges/analytic_code_small_color.png';
            } else {
                source = '/assets/images/badges/analytic_code_small_gray.png';
            }
            break;
        case 'papers':
            if (isFinal) {
                source = '/assets/images/badges/papers_small_color.png';
            } else {
                source = '/assets/images/badges/papers_small_gray.png';
            }
            break;
        case 'supplements':
            if (isFinal) {
                source = '/assets/images/badges/supplements_small_color.png';
            } else {
                source = '/assets/images/badges/supplements_small_gray.png';
            }
            break;
        default:
            source = '/assets/images/badges/data_small_inactive.svg';
            break;
        }

        return source;
    }
}
