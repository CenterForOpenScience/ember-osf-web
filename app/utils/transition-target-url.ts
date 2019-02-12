import Transition from '@ember/routing/-private/transition';

import cleanURL from 'ember-osf-web/utils/clean-url';

/**
 * Get the URL (path and query string) that the given transition will resolve to,
 * using the given router.
 */
export default function transitionTargetURL(
    transition: Transition,
) {
    const params = Object.values(transition.params).filter(
        param => Object.values(param).length,
    );
    return cleanURL(
        transition.router.generate(
            transition.targetName,
            ...params,
            { queryParams: transition.queryParams },
        ),
    );
}
