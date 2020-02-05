import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import { Store } from '../state/store';
import {
    State,
    Account
} from '../index.d';

class CBAccount extends HTMLElement {

    accountId: string | null;

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

        const account: Readonly<Account> | undefined = state.accounts[this.accountId];

        if (account === undefined) {
            return html`<div>Loading...</div>`;
        }

        return html`
            <h1>Account</h1>

            <h2>${account.id}</h2>

            <h3>Balance: ${account.balance}</h3>
        `;
    }
}

window.customElements.define('cb-account', CBAccount);