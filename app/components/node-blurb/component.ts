import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { get } from '@ember/object';
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

    @alias('getAuthors.lastComplete.value') authors;

    @computed('node.dateCreated')
    get date(this: NodeBlurb): string {
        return moment(this.get('node.dateCreated')).format('YYYY-MM-DD h:mm A');
    }

    @computed('blurbType')
    get blurbTypeTitle(this: NodeBlurb): string {
        return `node_blurb.${this.get('blurbType')}.title`;
    }

    @computed('node.description')
    get description(this: NodeBlurb): string | void {
        const description = this.get('node.description');
        if (!description) {
            return;
        }
        if (description.length > 150) {
            return `${description.slice(0, 150)}...`;
        }
        return description;
    }

    constructor() {
        super();
        get(this, 'getAuthors').perform();
    }
}
