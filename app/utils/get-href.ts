import { Link } from 'jsonapi-typescript';

import { RelatedLink } from 'osf-api';

export default function getHref(link: Link | RelatedLink) {
    return typeof link === 'string' ? link : link.href;
}
