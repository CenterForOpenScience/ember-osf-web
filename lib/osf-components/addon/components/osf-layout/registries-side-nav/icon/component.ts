import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class Icon extends Component {
    icon!: string;

    didReceiveAttrs() {
        assert(
            'OsfLayout::RegistriesSideNav::Icon: @icon is required for this component to render',
            Boolean(this.icon),
        );
    }
}
