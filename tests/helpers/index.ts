import { currentURL as _currentURL, settled, visit as _visit } from '@ember/test-helpers';
import { getContext } from '@ember/test-helpers/setup-context';

// With the current implementation of visit, if the transition is
// aborted for any reason (e.g. Redirects via guid routing) an
// error is thrown. In most cases theses errors should be safe to ignore
// https://github.com/emberjs/ember-test-helpers/issues/332
export async function visit(url: string) {
    try {
        await _visit(url);
    } catch (e) {
        if (e.message !== 'TransitionAborted') {
            throw e;
        }
    }

    await settled();
}

// The current implementation of currentURL pulls
// the url from the router itself. This ignores any transforms
// that may have happen to the URL from the location implementation.
// To allow existing tests to work well, delegate to location.
// eslint-disable-next-line max-len
// https://github.com/emberjs/ember-test-helpers/blob/47b094d516ec8c320879ea5d0eb1b4944cd136a4/addon-test-support/%40ember/test-helpers/setup-application-context.js#L52
export function currentURL() {
    const { owner } = (getContext() as any);
    const router = owner.lookup('router:main');
    return router.get('location').getURL();
}
