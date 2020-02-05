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

Store.dispatch({
    type: 'SET_ROUTE',
    route: {
        pathname: window.location.pathname,
        search: window.location.search
    }
});

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

        const classId: string | null = new URLSearchParams(state.route.search).get('classId');
        const accountId: string | null = new URLSearchParams(state.route.search).get('accountId');

        return html`
            <cb-classes ?hidden=${state.route.pathname !== '/' && state.route.pathname !== '/classes'}></cb-classes>
            <cb-class ?hidden=${state.route.pathname !== '/class'} .classId=${classId}></cb-class>
            <cb-account ?hidden=${state.route.pathname !== '/account'} .accountId=${accountId}></cb-account>
        `;
    }
}

window.customElements.define('cb-router', CBRouter);