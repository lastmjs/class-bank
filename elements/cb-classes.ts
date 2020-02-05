import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import { Store } from '../state/store';
import {
    State
} from '../index.d';

class CBClasses extends HTMLElement {
    constructor() {
        super();

        Store.subscribe(() => litRender(this.render(Store.getState()), this));
    }

    connectedCallback() {
        setTimeout(() => {
            Store.dispatch({
                type: 'RENDER'
            });
        });
    }

    render(state: Readonly<State>): Readonly<TemplateResult> {
        return html`
            cb-classes
        `;
    }
}

window.customElements.define('cb-classes', CBClasses);