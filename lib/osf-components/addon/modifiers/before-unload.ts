import Modifier from 'ember-modifier';

interface BeforeUnloadModifierArgs {
    positional: any;
    named: {};
}

export default class BeforeUnloadModifier extends Modifier<BeforeUnloadModifierArgs> {
    listener?: any;
    didReceiveArguments() {
        if (this.listener) {
            window.removeEventListener('beforeunload', this.listener);
        }
        this.listener = this.args.positional[0];
        window.addEventListener('beforeunload', this.listener);
    }

    willRemove() {
        window.removeEventListener('beforeunload', this.listener);
    }
}
