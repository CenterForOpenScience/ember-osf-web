import Modifier from 'ember-oo-modifiers';

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
class CaptureElementModifier extends Modifier {
    didInsertElement([captureFn]: [CaptureFn]) {
        captureFn(this.element);
    }

    willDestroyElement([captureFn]: [CaptureFn]) {
        captureFn(null);
    }
}

export default Modifier.modifier(CaptureElementModifier);
