import { layout, tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

@tagName('')
@layout(template)
export default class NavBar extends Component {
    dark: boolean = defaultTo(this.dark, false);
}
