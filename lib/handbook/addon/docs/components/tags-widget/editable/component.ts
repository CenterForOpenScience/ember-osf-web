import { action } from '@ember-decorators/object';
import Component from '@ember/component';

export default class Editable extends Component.extend() {
    // required arguments
    tags: string[] = ['Tag 1', 'Tag 2', 'Tag 3'];

    @action
    _addTag(this: Editable, tag: string) {
        this.set('tags', [...this.tags, tag].sort());
    }

    @action
    _removeTag(this: Editable, index: number) {
        this.set('tags', this.tags.slice().removeAt(index));
    }
}
