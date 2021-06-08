import Modifier from 'ember-modifier';

type CaptureFn = (e: Element | null) => void;

interface CaptureElementModifierArgs {
    positional: [CaptureFn];
    named: {};
}
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
export default class CaptureElementModifier extends Modifier<CaptureElementModifierArgs> {
    didInstall() {
        const captureFn = this.args.positional[0];
        captureFn(this.element);
    }

    willRemove() {
        const captureFn = this.args.positional[0];
        captureFn(null);
    }
}
