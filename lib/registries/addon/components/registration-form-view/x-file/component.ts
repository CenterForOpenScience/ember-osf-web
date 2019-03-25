import { tagName } from '@ember-decorators/component';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import { Answerable } from '../component';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class ViewFile extends Component {
    answerable!: Answerable;

    @alias('answerable.extra') fileList!: object[];
}
