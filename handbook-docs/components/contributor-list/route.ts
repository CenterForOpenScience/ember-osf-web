import Route from '@ember/routing/route';
import RSVP from 'rsvp';

import Node from 'ember-osf-web/models/node';

export default class extends Route {
    model() {
        return RSVP.hash([1, 2, 3, 23].reduce(
            (acc, contribCount) => {
                const id = `clst${contribCount}`;
                acc[contribCount] = this.store.findRecord('node', id, { include: 'bibliographic_contributors' });
                return acc;
            },
            {} as Record<string, Promise<Node>>,
        ));
    }
}
