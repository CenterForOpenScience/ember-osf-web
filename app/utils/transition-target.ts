import { Registry as ServiceRegistry } from '@ember/service';

interface Transition {
    targetName: string;
    params: any[];
    queryParams: object;
}

/**
 * Get the URL (path and query string) that the given transition will resolve to,
 * using the given router.
 */
export default function transitionTarget(
    transition: Transition,
    router: ServiceRegistry['router'],
) {
    const params = Object.values(transition.params).filter(
        param => Object.values(param).length,
    );
    return router.urlFor(
        transition.targetName,
        ...params,
        { queryParams: transition.queryParams },
    );
}
