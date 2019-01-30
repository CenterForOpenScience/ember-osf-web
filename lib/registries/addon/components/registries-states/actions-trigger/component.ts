import { computed } from '@ember-decorators/object';
import { not } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Media from 'ember-responsive';

import { layout } from 'ember-osf-web/decorators/component';
import RegistrationModel from 'ember-osf-web/models/registration';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

const StateToIconMap: Record<string, { text: string, icon: string }> = {
    public: {
        text: 'registries.overview.public.state',
        icon: 'eye',
    },
    pending: {
        text: 'registries.overview.pending.state',
        icon: 'hourglass-o',
    },
    embargoed: {
        text: 'registries.overview.embargoed.state',
        icon: 'lock',
    },
    withdrawn: {
        text: 'registries.overview.withdrawn.state',
        icon: 'ban',
    },
};

@layout(template, styles)
export default class ActionsTrigger extends Component {
      @service media!: Media;

      @not('media.isDesktop') showMobileView!: boolean;

      isDisabled?: boolean = defaultTo(this.isDisabled, false);
      node!: RegistrationModel;

      @computed('node.state')
      get registrationState(this: ActionsTrigger): object {
          if (this.node.state.includes('pending')) {
              return StateToIconMap.pending;
          }
          return StateToIconMap[this.node.state];
      }

      @computed('isDisabled', 'showMobileView')
      get buttonClass(this: ActionsTrigger): string {
          return `Trigger--${this.showMobileView ? 'mobile' : 'default'}${this.isDisabled ? ' disabled' : ''}`;
      }
}
