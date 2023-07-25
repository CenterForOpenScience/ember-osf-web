import { assert } from '@ember/debug';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

interface Args {
    success?: () => void;
    error?: () => void;
    disabled: Boolean;
    clipboardText: string;
}

export default class CopyButton extends Component<Args> {
    @task
    async copy() {
        assert('clipboardText is a required parameter.', Boolean(this.args.clipboardText));
        try {
            await navigator.clipboard.writeText(this.args.clipboardText);
            if(this.args.success) {
                this.args.success();
            }
        } catch(e) {
            if(this.args.error) {
                this.args.error();
            } else {
                throw(e);
            }
        }
    }
}
