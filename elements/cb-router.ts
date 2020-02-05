import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import { Store } from '../state/store';
import {
    State
} from '../index.d';
import './cb-classes';
import './cb-class';
import './cb-account';

window.addEventListener('popstate', () => {
    Store.dispatch({
        type: 'SET_ROUTE',
        route: {
            pathname: window.location.pathname,
            search: window.location.search
        }
    });
});

class CBRouter extends HTMLElement {
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
            <cb-classes ?hidden=${state.route.pathname !== '/' && state.route.pathname !== '/classes'}></cb-classes>
            <cb-class ?hidden=${state.route.pathname !== '/class'}></cb-class>
            <cb-account ?hidden=${state.route.pathname !== '/account'}></cb-account>
        `;
    }
}

window.customElements.define('cb-router', CBRouter);