import { attribute, tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import layout from './template';

@tagName('a')
export default class XAnchor extends Component {
    static positionalParams = ['href'];

    layout = layout;

    @attribute href?: string;
    onclick: (...args: any[]) => any = defaultTo(this.onclick, () => true);
}
