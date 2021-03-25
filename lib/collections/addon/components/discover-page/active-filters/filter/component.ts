import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';

import { FacetContext } from '../../component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class ActiveFiltersFilter extends Component {
    context!: FacetContext;
    item: any;
    text!: string;
    ariaLabel!: string;
    hide: boolean = false;
    extraClass: string = '';
}
