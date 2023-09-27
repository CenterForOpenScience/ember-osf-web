import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

interface BeforeUnloadModifierArgs {
    Args: {
      Positional: [listener: any],
      Named: {
      },
    };
  }

export default class BeforeUnloadModifier extends Modifier<BeforeUnloadModifierArgs> {
    listener?: undefined;
    constructor(owner: any, args: any) {
        super(owner, args);
        registerDestructor(this, this.cleanup);
    }

    modify(_: HTMLElement, listener: any, __: any) {
        if (this.listener) {
            window.removeEventListener('beforeunload', this.listener);
        }
        this.listener = listener[0];
        window.addEventListener('beforeunload', this.listener as any);
    }

    cleanup(instance: BeforeUnloadModifier) {
        window.removeEventListener('beforeunload', instance.listener as any);
    }
}
