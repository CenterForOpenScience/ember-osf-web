import Modifier from 'ember-modifier';

type CaptureFn = (e: Element | null) => void;

/**
 * `capture-element` modifier
 *
 * Usage:
 * ```
 * {{capture-element (action (mut this.myElement))}}
 * ```
 * The above is equivalent to:
 * ```
 * {{did-insert (action (mut this.myElement))}}
 * {{will-destroy (action (mut this.myElement) null)}}
 * ```
 */
export default class CaptureElementModifier extends Modifier {
    get captureFn(): CaptureFn {
        const captureFn = this.args.positional[0] as CaptureFn;
        return captureFn;
    }

    didInstall() {
        this.captureFn(this.element);
    }

    willRemove() {
        this.captureFn(null);
    }
}
