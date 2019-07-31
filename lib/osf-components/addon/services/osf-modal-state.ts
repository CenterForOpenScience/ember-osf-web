import { assert } from '@ember/debug';
import { schedule } from '@ember/runloop';
import Service from '@ember/service';

export default class OsfModalState extends Service {
    dialogWormholeTarget?: HTMLElement;

    inModalState!: boolean;

    private priorActiveElement: HTMLElement | null = null;

    enterModalState() {
        assert('Already in a modal state!', !this.inModalState);

        const { activeElement } = document;
        if (activeElement && activeElement instanceof HTMLElement) {
            this.priorActiveElement = activeElement;
        }

        const bodyElement = document.querySelector('body')!;
        bodyElement.classList.add('modal-open');

        this.set('inModalState', true);
    }

    exitModalState() {
        schedule('destroy', null, () => {
            const { priorActiveElement } = this;
            if (priorActiveElement && priorActiveElement.isConnected) {
                priorActiveElement.focus();
            }
            this.priorActiveElement = null;
        });

        const bodyElement = document.querySelector('body')!;
        bodyElement.classList.remove('modal-open');

        this.set('inModalState', false);
    }
}

declare module '@ember/service' {
  interface Registry {
    'osf-modal-state': OsfModalState;
  }
}
