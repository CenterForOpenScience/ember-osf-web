import Transition from '@ember/routing/transition';

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
    return transition.router.generate(
        transition.targetName,
        ...params,
        { queryParams: transition.queryParams },
    );
}
