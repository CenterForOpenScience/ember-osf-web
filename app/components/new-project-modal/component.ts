import Component from '@ember/component';
import { computed } from '@ember/object';

export default class NewProjectModal extends Component.extend({
    more: false,
    nodeTitle: null,

    actions: {
        toggle(property) {
            this.toggleProperty(property);
        },
    },
}) {
    more: boolean;
    newNode: any; // null|Node (from model)

    modalClass = computed('styleNamespace', function () {
        return `${this.get('styleNamespace')}__modal`;
    });
}
