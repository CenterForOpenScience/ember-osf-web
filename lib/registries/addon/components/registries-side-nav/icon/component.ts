import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';

@tagName('')
export default class Icon extends Component {
    icon!: string;

    didReceiveAttrs() {
        assert('@icon is required for this component to render', Boolean(this.icon));
    }
}
