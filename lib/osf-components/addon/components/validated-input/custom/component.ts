import { layout } from 'ember-osf-web/decorators/component';
import BaseValidatedComponent from '../base-component';
import template from './template';

@layout(template)
export default class ValidatedCheckbox extends BaseValidatedComponent {
}
