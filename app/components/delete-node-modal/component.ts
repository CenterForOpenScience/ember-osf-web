import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import randomScientist from 'ember-osf-web/utils/random-scientist';

export default class DeleteNodeModal extends Component {
    nodeType: string = defaultTo(this.nodeType, 'project');
    scientistName: string = '';
    scientistInput: string = '';

    didReceiveAttrs(this: DeleteNodeModal) {
        this.set('scientistInput', '');
        this.set('scientistName', randomScientist());
    }
}
