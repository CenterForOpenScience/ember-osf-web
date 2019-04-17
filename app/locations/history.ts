import { service } from '@ember-decorators/service';
import { getOwner } from '@ember/application';
import HistoryLocation from '@ember/routing/history-location';
import { task, waitForQueue } from 'ember-concurrency';

import GuidLocationMixin from 'ember-osf-web/locations/guid-mixin';
import Ready from 'ember-osf-web/services/ready';
import scrollTo from 'ember-osf-web/utils/scroll-to';

function splitFragment(url: string): [string, string?] {
    const [pathAndQuery, fragment] = url.split(/#(.+)?/, 2);

    // Strip any trailing slashes off the path, to match ember's treatment
    return [pathAndQuery.replace(/\/+(?=($|\?))/, ''), fragment];
}

// Add support for scrolling to elements according to the URL's #fragment.
export default class FragmentHistoryLocation extends HistoryLocation.extend(GuidLocationMixin, {
    scrollToFragment: task(function *(this: FragmentHistoryLocation, fragment: string) {
        yield this.ready.ready();

        yield waitForQueue('afterRender');

        // Not using `#id` as fragment could contain a `.`
        const element = document.querySelector(`[id="${fragment}"]`) as HTMLElement;
        if (element) {
            scrollTo(getOwner(this), element);
        }
    }).restartable(),
}) {
    @service ready!: Ready;

    replaceURL(newURL: string) {
        // As part of the initial transition, ember will try to strip away any URL fragment.
        // Instead, preserve the fragment and scroll to the element it identifies.
        const currentURL = this.getURL();
        const [currentPathAndQuery, fragment] = splitFragment(currentURL);

        if (fragment && newURL === currentPathAndQuery) {
            this.scrollToFragment.perform(fragment);
            return super.replaceURL(`${newURL}#${fragment}`);
        }
        return super.replaceURL(newURL);
    }

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
