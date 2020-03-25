import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import { GlobalStore } from '../state/store';
import {
    StudentAccount,
    GlobalState
} from '..';
import { createObjectStore } from 'reduxular';

type LocalState = {
    readonly studentAccountId: string | null;
};

const InitialLocalState: Readonly<LocalState> = {
    studentAccountId: null
};

class CBStudentAccount extends HTMLElement {

    readonly localStore = (() => {

        GlobalStore.subscribe(() => {
            litRender(
                this.render(
                    this.localStore.getState(),
                    GlobalStore.getState()
                ),
            this);
        });

        return createObjectStore(InitialLocalState, (localState: Readonly<LocalState>) => {
            litRender(
                this.render(
                    localState,
                    GlobalStore.getState()
                ),
            this);
        }, this);
    })();

    set studentAccountId(studentAccountId: string) {
        
        if (this.localStore.studentAccountId === studentAccountId) {
            return;
        }

        this.localStore.studentAccountId = studentAccountId;

        const studentAccount: Readonly<StudentAccount> = GlobalStore.getState().studentAccounts[studentAccountId];

        // TODO figure out why we have to throw this on the event loop to stop from overflowing the call stack
        // TODO seems like this.localStore.studentGroupId is not updating correctly
        setTimeout(() => {
            GlobalStore.dispatch({
                type: 'SET_TOP_BAR_TEXT',
                topBarText: `Student - ${studentAccount.name}`
            });
        });
    }

    addToBalance() {
        const dollarAmount = (this.querySelector(`#input-dollar-amount`) as any).value;

        GlobalStore.dispatch({
            type: 'ADD_TO_BALANCE',
            studentAccountId: this.localStore.getState().studentAccountId,
            amount: dollarAmount * 100
        });
    }

    deposit() {
        const dollarAmount = (this.querySelector(`#cb-student-account-deposit-input`) as any).value;

        GlobalStore.dispatch({
            type: 'ADD_TO_BALANCE',
            studentAccountId: this.localStore.getState().studentAccountId,
            amount: Math.abs(dollarAmount) * 100
        });
    }

    withdraw() {
        const dollarAmount = (this.querySelector(`#cb-student-account-withdraw-input`) as any).value;

        GlobalStore.dispatch({
            type: 'ADD_TO_BALANCE',
            studentAccountId: this.localStore.getState().studentAccountId,
            amount: -Math.abs(dollarAmount) * 100
        });
    }

    render(
        localState: Readonly<LocalState>,
        globalState: Readonly<GlobalState>
    ): Readonly<TemplateResult> {

        const account: Readonly<StudentAccount> | undefined = globalState.studentAccounts[localState.studentAccountId];

        if (account === undefined) {
            return html`<div>Loading...</div>`;
        }

        return html`
            <style>
                .cb-student-account-main-container {
                    height: 100%;
                }

                .cb-student-account-grid-container {
                    height: 100%;
                    padding: calc(5px + 1vmin);
                    display: grid;
                    grid-template-rows: 5fr 10fr 10fr 10fr;
                }

                .cb-student-account-student-account-id {
                    display: flex;
                    color: grey;
                    font-size: calc(25px + 1vmin);
                }

                .cb-student-account-monetary-item-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .cb-student-account-monetary-label {
                    font-size: calc(50px + 1vmin);
                    color: grey;
                }

                .cb-student-account-monetary-input {
                    font-size: calc(100px + 1vmin);
                    width: 50%;
                    border: none;
                    border-bottom: 1px solid black;
                    text-align: center;
                }

                .cb-student-account-monetary-button {
                    font-size: calc(50px + 1vmin);
                    color: grey;
                    background-color: white;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0px 0px 5px black;
                    padding: calc(5px + 1vmin);
                    margin: calc(5px + 1vmin);
                }
            </style>
            
            <div class="cb-student-account-main-container">
                <div class="cb-student-account-grid-container">
                    <div class="cb-student-account-student-account-id">${account.id}</div>
                    <div class="cb-student-account-monetary-item-container">
                        <div style="font-size: calc(100px + 1vmin)">$${(account.balance / 100).toFixed(2)}</div>
                        <div class="cb-student-account-monetary-label">Balance</div>
                    </div>
                    <div class="cb-student-account-monetary-item-container">
                        <input id="cb-student-account-deposit-input" type="number" min="0" value="0" class="cb-student-account-monetary-input">
                        <button class="cb-student-account-monetary-button" @click=${() => this.deposit()}>Deposit</button>
                    </div>
                    <div class="cb-student-account-monetary-item-container">
                        <input id="cb-student-account-withdraw-input" type="number" min="0" value="0" class="cb-student-account-monetary-input">
                        <button class="cb-student-account-monetary-button" @click=${() => this.withdraw()}>Withdraw</button>
                    </div>
                </div>
            </div>
        `;
    }
}

window.customElements.define('cb-student-account', CBStudentAccount);