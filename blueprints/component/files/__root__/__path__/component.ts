import Component from '@ember/component';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
<%= importStyles %><%= importTemplate %>
@localClassNames('<%=classifiedModuleName %>')
export default class <%= classifiedModuleName %> extends Component {<%= contents %>
}
