import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import { GlobalStore } from '../state/store';
import {
    Route
} from '../index.d';
import './cb-student-groups';
import './cb-student-group';
import './cb-student-account';
import { createObjectStore } from 'reduxular';

GlobalStore.dispatch({
    type: 'SET_ROUTE',
    route: {
        pathname: window.location.pathname,
        search: window.location.search
    }
});

window.addEventListener('popstate', () => {
    GlobalStore.dispatch({
        type: 'SET_ROUTE',
        route: {
            pathname: window.location.pathname,
            search: window.location.search
        }
    });
});

type State = {
    readonly route: Readonly<Route>;
};

const InitialState: Readonly<State> = {
    route: GlobalStore.getState().route
};

class CBRouter extends HTMLElement {

    readonly store = (() => {

        GlobalStore.subscribe(() => {
            this.store.route = GlobalStore.getState().route;
        });

        return createObjectStore(InitialState, (state: Readonly<State>) => {
            litRender(this.render(state), this);
        }, this);
    })();

    render(state: Readonly<State>): Readonly<TemplateResult> {
        const studentGroupId: string | null = new URLSearchParams(state.route.search).get('studentGroupId'); 
        const studentAccountId: string | null = new URLSearchParams(state.route.search).get('studentAccountId'); 

        return html`
            <cb-student-groups ?hidden=${state.route.pathname !== '/' && state.route.pathname !== '/classes'}></cb-student-groups>
            <cb-student-group ?hidden=${state.route.pathname !== '/student-group'} .studentGroupId=${studentGroupId}></cb-student-group>
            <cb-student-account ?hidden=${state.route.pathname !== '/student-account'} .studentAccountId=${studentAccountId}></cb-student-account>
        `;
    }
}

window.customElements.define('cb-router', CBRouter);