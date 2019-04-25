import { computed } from '@ember-decorators/object';
import { not } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Media from 'ember-responsive';

import { layout } from 'ember-osf-web/decorators/component';
import RegistrationModel, { RegistrationState } from 'ember-osf-web/models/registration';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ActionsTrigger extends Component {
      @service media!: Media;

      @not('media.isDesktop') showMobileView!: boolean;

      isDisabled?: boolean = defaultTo(this.isDisabled, false);
      registration!: RegistrationModel;

      @computed('registration.state')
      get registrationState(this: ActionsTrigger): object {
          const { registration } = this;
          const {
              PendingRegistration,
              PendingWithdrawal,
              PendingEmbargo,
              PendingEmbargoTermination,
              Withdrawn,
              Embargoed,
          } = RegistrationState;

          switch (registration.state) {
          case PendingRegistration:
          case PendingWithdrawal:
          case PendingEmbargo:
          case PendingEmbargoTermination:
              return {
                  text: 'registries.overview.pending.state',
                  icon: 'hourglass-o',
              };
          case Withdrawn:
              return {
                  text: 'registries.overview.withdrawn.state',
                  icon: 'ban',
              };
          case Embargoed:
              return {
                  text: 'registries.overview.embargoed.state',
                  icon: 'lock',
              };
          default:
              return {
                  text: 'registries.overview.public.state',
                  icon: 'eye',
              };
          }
      }

      @computed('isDisabled', 'showMobileView')
      get buttonClass(this: ActionsTrigger): string {
          return `Trigger--${this.showMobileView ? 'mobile' : 'default'}${this.isDisabled ? ' disabled' : ''}`;
      }
}
