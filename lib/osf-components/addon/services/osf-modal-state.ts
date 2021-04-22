import { assert } from '@ember/debug';
import { run, schedule } from '@ember/runloop';
import Service from '@ember/service';

export default class OsfModalState extends Service {
    dialogWormholeTarget?: HTMLElement;

    inModalState = false;

    private priorActiveElement: HTMLElement | null = null;

    enterModalState() {
        assert('Already in a modal state!', !this.inModalState);

        const { activeElement } = document;
        if (activeElement && activeElement instanceof HTMLElement) {
            this.priorActiveElement = activeElement;
        }

        // Update global state in another runloop to avoid "modified twice in one render" errors
        run.next(this, function() {
            if (this.isDestroyed) {
                // In tests, the service might be destroyed by now
                return;
            }
            const bodyElement = document.querySelector('body')!;
            bodyElement.classList.add('modal-open');

            this.set('inModalState', true);
        });
    }

    exitModalState() {
        // Update global state in another runloop to avoid "modified twice in one render" errors
        run.next(this, function() {
            if (this.isDestroyed) {
                // In tests, the service might be destroyed by now
                return;
            }
            const bodyElement = document.querySelector('body')!;
            bodyElement.classList.remove('modal-open');

            this.set('inModalState', false);

            // ...and wait for `priorActiveElement` to become focusable again
            schedule('afterRender', this, function() {
                const { priorActiveElement } = this;
                if (priorActiveElement && priorActiveElement.isConnected) {
                    priorActiveElement.focus();
                }
                this.priorActiveElement = null;
            });
        });
    }
}

declare module '@ember/service' {
  interface Registry {
    'osf-modal-state': OsfModalState;
  }
}
