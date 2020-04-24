import { getOwner } from '@ember/application';
import HistoryLocation from '@ember/routing/history-location';
import { inject as service } from '@ember/service';
import { waitForQueue } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';

import GuidLocationMixin from 'ember-osf-web/locations/guid-mixin';
import OsfRouterService from 'ember-osf-web/services/osf-router';
import Ready from 'ember-osf-web/services/ready';
import scrollTo from 'ember-osf-web/utils/scroll-to';

function splitFragment(url: string): [string, string?] {
    const [pathAndQuery, fragment] = url.split(/#(.+)?/, 2);

    // Strip any trailing slashes off the path, to match ember's treatment
    return [pathAndQuery.replace(/\/+(?=($|\?))/, ''), fragment];
}

// Add support for scrolling to elements according to the URL's #fragment.
export default class FragmentHistoryLocation extends HistoryLocation.extend(GuidLocationMixin) {
    @service ready!: Ready;

    @service osfRouter!: OsfRouterService;

    @task({ restartable: true })
    scrollToElement = task(function *(this: FragmentHistoryLocation, elementId: string) {
        yield this.ready.ready();

        yield waitForQueue('afterRender');

        // Not using `#id` as fragment could contain a `.`
        const element = document.querySelector(`[id="${elementId}"]`) as HTMLElement;
        if (element) {
            scrollTo(getOwner(this), element);
        }
    });

    /**
     * `setURL` is called during in-app transitions that use `transitionTo`
     * to update the URL displayed to the user and push a new history entry.
     * It is not called during the app's initial transition.
     */
    setURL(newURL: string) {
        const fragment = this.osfRouter.currentTransitionTargetFragment;
        if (fragment) {
            this.osfRouter.set('currentTransitionTargetFragment', null);
            this.scrollToElement.perform(fragment);
            return super.setURL(`${newURL}#${fragment}`);
        }
        return super.setURL(newURL);
    }

    /**
     * `replaceURL` is called during in-app transitions that use `replaceWith`
     * to update the URL displayed to the user without pushing a new history entry.
     * It *is* called during the app's initial transition.
     */
    replaceURL(newURL: string) {
        // As part of the initial transition, ember will try to strip away any URL fragment.
        // Instead, preserve the fragment and scroll to the element it identifies.
        const currentURL = this.getURL();
        const [currentPathAndQuery, fragment] = splitFragment(currentURL);

        if (fragment && newURL === currentPathAndQuery) {
            this.scrollToElement.perform(fragment);
            return super.replaceURL(`${newURL}#${fragment}`);
        }
        return super.replaceURL(newURL);
    }

    /**
     * `onUpdateURL` is called when something other than Ember updates the URL.
     */
    onUpdateURL(callback: (newURL: string) => void) {
        // When the user clicks a link with `href="#fragment"`, don't call ember's `popstate` callback.
        // Instead, let the browser scroll to the fragment-identified element as normal.
        const maybeCallback = (newURL: string) => {
            const pathOrQueryChanged = splitFragment(this._previousURL)[0] !== splitFragment(newURL)[0];
            if (pathOrQueryChanged) {
                callback(newURL);
            }
        };
        return super.onUpdateURL(maybeCallback);
    }
}
