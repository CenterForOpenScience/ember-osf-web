import { assert } from '@ember/debug';
import Transition from '@ember/routing/-private/transition';
import RouterService from '@ember/routing/router-service';
import Service, { inject as service } from '@ember/service';

export default class OsfRouterService extends Service {
    @service router!: RouterService;

    currentTransitionTargetFragment: string | null = null;

    /**
     * Wrapper for Ember's RouterService.transitionTo that takes an additional
     * `fragment` option, e.g.
     * ```
     * osfRouter.transitionTo(
     *   'foo.route',
     *   modelOne,
     *   modelTwo,
     *   {
     *     fragment: 'bar',
     *     queryParams: { ... },
     *   },
     * );
     * ```
     */
    transitionTo(routeName: string, ...args: any[]): Transition {
        const possibleOptions = args[args.length - 1];
        if (
            typeof possibleOptions === 'object'
            && possibleOptions !== null
            && possibleOptions.fragment
        ) {
            const { fragment } = possibleOptions as { fragment?: string };
            assert('OsfRouterService.transitionTo: `fragment` must be a string', typeof fragment === 'string');

            this.set('currentTransitionTargetFragment', fragment);
        }
        return this.router.transitionTo(routeName, ...args);
    }
}

declare module '@ember/service' {
    interface Registry {
        'osf-router': OsfRouterService;
    }
}
