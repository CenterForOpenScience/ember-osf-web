import { layout, tagName } from '@ember-decorators/component';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import Media from 'ember-responsive';
import template from './template';

@tagName('')
@layout(template)
export default class NavBar extends Component {
    @service media!: Media;

    dark: boolean = defaultTo(this.dark, false);
}
