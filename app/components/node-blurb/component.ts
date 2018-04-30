import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import moment from 'moment';

import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import defaultTo from 'ember-osf-web/utils/default-to';

enum BlurbType {
    FORK = 'fork',
}

export default class NodeBlurb extends Component {
    node?: Node | Registration;
    blurbType: BlurbType = defaultTo(this.blurbType, BlurbType.FORK);

    getAuthors = task(function* (this: NodeBlurb) {
        const node = yield this.get('node');
        const authors = yield node.queryHasMany('contributors', {
            filter: { bibliographic: true },
        });
        return authors;
    });

    @computed('node')
    get authors(this: NodeBlurb): Promise<Contributor[]> {
        return this.get('getAuthors').perform();
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
