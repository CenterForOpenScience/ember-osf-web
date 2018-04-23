import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import moment from 'moment';

import Node from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';

export default class NodeBlurb extends Component {
    node: Node | Registration;
    blurbType: 'fork';

    getAuthors = task(function* (this: NodeBlurb) {
        const node = yield this.get('node');
        const authors = yield node.queryHasMany('contributors', {
            filter: { bibliographic: true },
        });
        return authors;
    });

    @computed('node')
    get authors(this: NodeBlurb) {
        return this.get('getAuthors').perform();
    }

    @computed('node.dateCreated')
    get date(this: NodeBlurb): string {
        return moment(this.get('node').get('dateCreated')).format('YYYY-MM-DD h:mm A');
    }

    @computed('blurbType')
    get blurbTypeTitle(this: NodeBlurb): string {
        return `node_blurb.${this.get('blurbType')}.title`;
    }

    @computed('node.description')
    get description(this: NodeBlurb): string | void {
        const description = this.get('node').get('description');
        if (!description) {
            return;
        }
        if (description.length > 150) {
            return `${description.slice(0, 150)}...`;
        }
        return description;
    }
}
