import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import './cb-router';
import { GlobalStore } from '../state/store';
import { createObjectStore } from 'reduxular';

type State = {};

const InitialState: Readonly<State> = {};

class CBApp extends HTMLElement {

    readonly store = (() => {

        GlobalStore.subscribe(() => {
            this.store.dispatch({
                type: 'RENDER'
            });
        });

        return createObjectStore(InitialState, (state: Readonly<State>) => {
            litRender(this.render(state), this);
        }, this);
    })();

    render(state: Readonly<State>): Readonly<TemplateResult> {
        return html`
            <cb-router></cb-router>
        `;
    }
}

window.customElements.define('cb-app', CBApp);