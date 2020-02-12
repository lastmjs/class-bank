import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import { GlobalStore } from '../state/store';
import {
    StudentAccount,
    StudentAccounts
} from '..';
import { createObjectStore } from 'reduxular';

type State = {
    readonly studentAccountId: string | null;
    readonly studentAccounts: Readonly<StudentAccounts>;
};

const InitialState: Readonly<State> = {
    studentAccountId: null,
    studentAccounts: GlobalStore.getState().studentAccounts
};

class CBStudentAccount extends HTMLElement {

    readonly store = (() => {

        GlobalStore.subscribe(() => {
            this.store.studentAccounts = GlobalStore.getState().studentAccounts;
        });

        return createObjectStore(
            InitialState,
            (state: Readonly<State>) => litRender(this.render(state), this),
            this
        );
    })();

    addToBalance() {
        const dollarAmount = (this.querySelector(`#input-dollar-amount`) as any).value;

        GlobalStore.dispatch({
            type: 'ADD_TO_BALANCE',
            studentAccountId: this.store.getState().studentAccountId,
            amount: dollarAmount * 100
        });
    }

    render(state: Readonly<State>): Readonly<TemplateResult> {

        const account: Readonly<StudentAccount> | undefined = state.studentAccounts[state.studentAccountId];

        if (account === undefined) {
            return html`<div>Loading...</div>`;
        }

        return html`
            <h1>Account</h1>

            <h2>${account.id}</h2>

            <h3>Balance: $${(account.balance / 100).toFixed(2)}</h3>

            <br>

            <input id="input-dollar-amount" type="number" placeholder="Enter dollar amount">

            <button @click=${() => this.addToBalance()}>Add to balance</button>
        `;
    }
}

window.customElements.define('cb-student-account', CBStudentAccount);