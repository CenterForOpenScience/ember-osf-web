import { action } from '@ember-decorators/object';
import Controller from '@ember/controller';

export default class TagsWidgetController extends Controller {
    tags: string[] = ['Tag 1', 'Tag 2', 'Tag 3'];

    @action
    addTag(tag: string) {
        this.set('tags', [...this.tags, tag].sort());
    }

    @action
    removeTag(index: number) {
        this.set('tags', this.tags.slice().removeAt(index));
    }
}
