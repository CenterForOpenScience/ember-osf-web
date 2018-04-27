import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import moment from 'moment';

import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import defaultTo from 'ember-osf-web/utils/default-to';

export default class NodeBlurb extends Component {
    node?: Node | Registration;
    blurbType: 'fork' = defaultTo(this.blurbType, 'fork');

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

    @computed('node.description')
    get description(this: NodeBlurb): string | void {
        if (!this.node) {
            return '';
        }
        const description = this.node.get('description');
        if (!description) {
            return;
        }
        if (description.length > 150) {
            return `${description.slice(0, 150)}...`;
        }
        return description;
    }
}
