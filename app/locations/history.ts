import { service } from '@ember-decorators/service';
import { getOwner } from '@ember/application';
import HistoryLocation from '@ember/routing/history-location';
import { scheduleOnce } from '@ember/runloop';
import GuidLocationMixin from 'ember-osf-web/locations/guid-mixin';
import Ready from 'ember-osf-web/services/ready';
import scrollTo from 'ember-osf-web/utils/scroll-to';

// Only history has the ability to support fragments in the URL
// Other implementations may use fragments for URL tracking. (Not that we use them).
export default class FragmentHistoryLocation extends HistoryLocation.extend(GuidLocationMixin) {
    @service ready!: Ready;

    replaceURL(url: string) {
        const currentURL = this.getURL();
        const [fragmentLess, fragment] = this.splitFragment(currentURL);

        // if there's not fragment or a real URL change/replace don't do anything
        if (!fragment || fragmentLess !== url) {
            return super.replaceURL(url);
        }

        // Wait for the page to be completely loaded
        this.ready.ready().then(
            // Schedule the scrollTo afterRender to maximize
            // the chance that the target element is rendered
            () => scheduleOnce('afterRender', this, () => {
                // Not using #id as fragment could contain a `.`
                const element = document.querySelector(`[id="${fragment}"]`) as HTMLElement;

                // No harm no foul
                if (!element) {
                    return;
                }

                scrollTo(getOwner(this), element);
            }),
        );

        return super.replaceURL(currentURL);
    }

    onUpdateURL(callback: (url: string) => void) {
        this._removeEventListener();

        this._popstateHandler = () => {
            const url = this.getURL();
            const fragmentLess = this.stripFragment(url);

            // If only the fragment has changed, eat the event.
            // The browser will scroll to the first element with id=fragment
            // Ember shouldn't do anything
            if (this._previousURL && fragmentLess === this.stripFragment(this._previousURL)) {
                return;
            }

            // callback here is a method on the router that strips out
            // URL fragments anyways. So it doesn't matter if the passed URL
            // contains one.
            callback(url);
        };

        window.addEventListener('popstate', this._popstateHandler);
    }

    private splitFragment(url: string): [string, string?] {
        const [fragmentLess, fragment] = url.split(/#(.+)?/);
        return [fragmentLess, fragment];
    }

    private stripFragment(url: string): string {
        return url.split(/#(.+)?/)[0];
    }
}
