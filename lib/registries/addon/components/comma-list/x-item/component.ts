import { layout, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template)
export default class CommaListItem<T> extends Component {
    static positionalParams = ['item'];

    styles = styles;

    item!: T;
    index!: number;
    length!: number; // eslint-disable-line no-restricted-globals
    cutOff?: number;

    @computed('index', 'cutOff')
    get isHidden() {
        return Boolean(this.cutOff) && this.index > this.cutOff!;
    }

    @computed('index', 'cutOff', 'length')
    get isLast() {
        return this.index === (this.cutOff || (this.length - 1));
    }
}
