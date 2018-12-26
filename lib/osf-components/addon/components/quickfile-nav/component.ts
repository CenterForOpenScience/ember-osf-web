import { attribute, classNames, tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@classNames('row')
@tagName('nav')
export default class QuickfileNav extends Component {
    @attribute role = 'navigation';
}
