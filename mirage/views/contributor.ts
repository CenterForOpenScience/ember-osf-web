import { ModelInstance } from 'ember-cli-mirage';

import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';

export function createBibliographicContributor(
    node: ModelInstance<Node>,
    contributor: ModelInstance<Contributor>,
) {
    if (contributor.bibliographic) {
        node.bibliographicContributors.models.pushObject(contributor);
        node.save();
    }
}
