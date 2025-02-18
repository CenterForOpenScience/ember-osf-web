import Component from '@glimmer/component';

export default class ActivityLogComponent extends Component {
    public loadEmbeds = {
        embed:
            [
                'group', 'linked_node', 'linked_registration', 'original_node',
                'template_node', 'user',
            ],
    };
}
