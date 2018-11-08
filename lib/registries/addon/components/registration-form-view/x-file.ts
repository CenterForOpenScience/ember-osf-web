import { layout, tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { Answerable } from './component';

@tagName('')
@layout(hbs`<p>
    <a href={{this.part.extra.viewUrl}}>
        {{this.part.value}}
    </a>
</p>`)
export default class ViewText extends Component {
    static positionalParams = ['part'];

    part!: Answerable;
}
