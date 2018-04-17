import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import randomScientist from 'ember-osf-web/utils/random-scientist';

export default class DeleteNodeModal extends Component.extend({
    didReceiveAttrs(this: DeleteNodeModal) {
        this._super(...arguments);
        this.set('scientistName', randomScientist());
    },
}) {
    nodeType: string = defaultTo(this.nodeType, 'project');
    scientistName: string;
}
