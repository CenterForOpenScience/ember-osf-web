import Component from '@glimmer/component';

export default class ActivityLogComponent extends Component {
    public loadEmbeds = {
        embed:
            [
                'user' , 'linked_node', 'template_node',
                'group', 'linked_registration',
                // 'orginal_node'
            ],
    };
}
