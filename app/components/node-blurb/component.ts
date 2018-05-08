import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import moment from 'moment';

import Node from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import defaultTo from 'ember-osf-web/utils/default-to';

enum BlurbType {
    FORK = 'fork',
}

export default class NodeBlurb extends Component {
    node?: Node | Registration;
    blurbType: BlurbType = defaultTo(this.blurbType, BlurbType.FORK);

    @computed('node.currentUserPermissions')
    get canEdit(this: NodeBlurb): boolean {
        if (!this.node || !this.node.get('currentUserPermissions')) {
            return false;
        }
        return this.node.get('currentUserPermissions').includes('write');
    }

    @computed('node.dateCreated')
    get date(this: NodeBlurb): string {
        if (!this.node) {
            return '';
        }
        return moment(this.node.get('dateCreated')).format('YYYY-MM-DD h:mm A');
    }

    @computed('blurbType')
    get blurbTypeTitle(this: NodeBlurb): string {
        return `node_blurb.${this.get('blurbType')}.title`;
    }
}
