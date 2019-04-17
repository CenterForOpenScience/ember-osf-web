import { click as _click, settled, Target, visit as _visit } from '@ember/test-helpers';
import { getContext } from '@ember/test-helpers/setup-context';
import { faker } from 'ember-cli-mirage';
import config from 'ember-get-config';
import { setupApplicationTest } from 'ember-qunit';

const {
    OSF: {
        analyticsAttrs,
    },
} = config;

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

        // Set this.element for application tests as the original
        // visit's attempt to do so was interupted by an exception
        const context: any = getContext();
        context.element = document.querySelector('#ember-testing');
    }

    await settled();
}

/*
 * Custom click helper! In addition to calling the normal click helper from
 * @ember/test-helpers, will error the click target is not correctly
 * ornamented with a "data-analytics-name" attribute. If a click is important
 * enough to be in a test, it's important enough to warrant analytics.
 */
export async function click(target: Target) {
    const element: Element = (target instanceof Element) ? target : document.querySelector(target)!;
    if (element === null) {
        throw Error(`Tried to test click, but query selector for ${target} is not on the page`);
    }
    if (!element.hasAttribute(analyticsAttrs.name)) {
        throw Error(`Untracked click! Add a "${analyticsAttrs.name}" attribute to ${target}`);
    }

    await _click(target);
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

export function setupOSFApplicationTest(hooks: any) {
    setupApplicationTest(hooks);
    hooks.beforeEach(async () => {
        faker.seed(17);
    });

    hooks.afterEach(async (assert: any) => {
        assert.dom('img[alt*="Missing translation"]').doesNotExist();
    });
}
