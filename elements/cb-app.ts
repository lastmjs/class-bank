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
            <cb-router></cb-router>
        `;
    }
}

window.customElements.define('cb-app', CBApp);