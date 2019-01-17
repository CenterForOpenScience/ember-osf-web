import { Relationship } from 'osf-api';

import getHref from './get-href';

export default function getRelatedHref(relationship: Relationship) {
    if ('links' in relationship) {
        return getHref(relationship.links.related);
    }
    return undefined;
}
