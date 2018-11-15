import { attribute, tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import template from './template';

@layout(template)
@tagName('a')
export default class XAnchor extends Component {
    static positionalParams = ['href'];

    @attribute href?: string;
}
