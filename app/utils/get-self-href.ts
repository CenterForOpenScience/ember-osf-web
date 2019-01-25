import { Relationship } from 'osf-api';

import { Link } from 'jsonapi-typescript';
import getHref from './get-href';

export default function getSelfHref(relationship: Relationship) {
    if ('links' in relationship) {
        return getHref(relationship.links.self as Link);
    }
    return undefined;
}
