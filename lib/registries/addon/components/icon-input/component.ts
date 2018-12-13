import { layout, tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import template from './template';

@tagName('')
@layout(template)
export default class Content extends Component {
    icon!: string;
    dark: boolean = defaultTo(this.dark, false);

    value: string = '';

    enter?: (value: string) => void;

    @action
    _enter(value: string) {
        if (this.enter) {
            this.enter(value);
        }
    }
}
