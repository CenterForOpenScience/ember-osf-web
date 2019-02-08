import { HandlerContext, Schema } from 'ember-cli-mirage';

import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import User from 'ember-osf-web/models/user';

import { Root } from '../factories/root';

export function createNode(this: HandlerContext, schema: Schema) {
    const attrs = this.normalizedRequestAttrs();
    const now = (new Date()).toISOString();
    const node = schema.nodes.create<Node>({
        ...attrs,
        dateModified: now,
        dateCreated: now,
    });

    const userId = schema.roots.first<Root>().currentUserId;

    if (userId) {
        const currentUser = schema.users.find<User>(userId);
        schema.contributors.create<Contributor>({ node, users: currentUser, index: 0 });
    }

    return node;
}
