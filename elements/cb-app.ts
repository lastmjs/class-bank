import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import './cb-router';
import { Store } from '../state/store';
import {
    State
} from '../index.d';
import {
    navigate
} from '../services/utilities';

class CBApp extends HTMLElement {

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
            <button @click=${() => navigate('/classes')}>Classes</button>
            <button @click=${() => navigate('/class')}>Class</button>
            <button @click=${() => navigate('/account')}>Account</button>
            <cb-router></cb-router>
        `;
    }
}

window.customElements.define('cb-app', CBApp);