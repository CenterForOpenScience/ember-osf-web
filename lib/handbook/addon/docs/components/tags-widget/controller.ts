import { action } from '@ember-decorators/object';
import Controller from '@ember/controller';

export default class TagsWidgetController extends Controller {
    // required arguments
    tags: string[] = ['Tag 1', 'Tag 2', 'Tag 3'];

    @action
    addTag(this: TagsWidgetController, tag: string) {
        this.set('tags', [...this.tags, tag].sort());
    }

    @action
    removeTag(this: TagsWidgetController, index: number) {
        this.set('tags', this.tags.slice().removeAt(index));
    }
}
