import { Relationship } from 'osf-api';

import getHref from './get-href';

export default function getSelfHref(relationship: Relationship) {
    if ('links' in relationship && relationship.links.self) {
        return getHref(relationship.links.self);
    }
    return undefined;
}
