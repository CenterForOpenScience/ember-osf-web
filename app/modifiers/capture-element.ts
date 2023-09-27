import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

type CaptureFn = (e: Element | null) => void;

interface CaptureElementModifierSignature {
    Args: {
      Positional: [any],
      Named: {},
    };
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
export default class CaptureElementModifier extends Modifier<CaptureElementModifierSignature> {
    captureFn?: any;

    constructor(owner: any, args: any) {
        super(owner, args);
        registerDestructor(this, this.willRemove);
    }

    modify(element: any, CaptureFn: [CaptureFn], _: any) {
        this.captureFn = CaptureFn[0];
        this.captureFn(element);
    }

    willRemove(instance: CaptureElementModifier) {
        if (instance.captureFn){
            instance.captureFn(null);
        }
    }
}
