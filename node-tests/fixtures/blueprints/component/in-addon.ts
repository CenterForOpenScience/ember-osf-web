import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import styles from './styles';
import template from './template';

@layout(template, styles)
@localClassNames('FooBar')
export default class FooBar extends Component {
}
