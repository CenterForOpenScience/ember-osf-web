import Transition from '@ember/routing/-private/transition';

import cleanURL from 'ember-osf-web/utils/clean-url';

/**
 * Get the URL (path and query string) that the given transition will resolve to,
 * using the given router.
 */
export default function transitionTargetURL(
    transition: Transition,
) {
    const keys = Object.keys(transition);
    const paramsKey = keys.filter(key => key.match(/^__PARAMS__/))[0];
    const params = Object.values(transition[paramsKey]).filter(
        param => Object.values(param).length,
    );
    return cleanURL(
        transition.router.generate(
            transition.targetName,
            ...params,
            { queryParams: transition.to.queryParams },
        ),
    );
}
