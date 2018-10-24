import { attribute, tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import layout from './template';

@tagName('a')
export default class XAnchor extends Component {
    static positionalParams = ['href'];

    layout = layout;

    @attribute href?: string;
}
