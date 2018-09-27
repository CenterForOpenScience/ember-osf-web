import { attribute, layout } from '@ember-decorators/component';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';

@layout(hbs`{{yield}}`)
export default class Dummy extends Component {
    @attribute role!: string;
    @attribute href!: string;
    @alias('click') onclick!: () => void;
}
