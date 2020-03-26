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
    readonly depositInputValue: string;
    readonly withdrawInputValue: string;
};

const InitialLocalState: Readonly<LocalState> = {
    studentAccountId: null,
    depositInputValue: '0',
    withdrawInputValue: '0'
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

    deposit() {
        GlobalStore.dispatch({
            type: 'ADD_TO_BALANCE',
            studentAccountId: this.localStore.getState().studentAccountId,
            amount: Math.abs(parseInt(this.localStore.depositInputValue)) * 100
        });

        this.localStore.depositInputValue = '0';
    }

    withdraw() {
        GlobalStore.dispatch({
            type: 'ADD_TO_BALANCE',
            studentAccountId: this.localStore.getState().studentAccountId,
            amount: -Math.abs(parseInt(this.localStore.withdrawInputValue)) * 100
        });

        this.localStore.withdrawInputValue = '0';
    }

    depositInputChanged(e: any) {
        const depositInputValue: string = e.target.value;
        this.localStore.depositInputValue = depositInputValue;
    }

    withdrawInputChanged(e: any) {
        const withdrawInputValue: string = e.target.value;
        this.localStore.withdrawInputValue = withdrawInputValue;
    }

    render(
        localState: Readonly<LocalState>,
        globalState: Readonly<GlobalState>
    ): Readonly<TemplateResult> {

        console.log(localState)

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
                        <input id="cb-student-account-deposit-input" type="number" min="0" @input=${(e: any) => this.depositInputChanged(e)} .value=${localState.depositInputValue} class="cb-student-account-monetary-input">
                        <button class="cb-student-account-monetary-button" @click=${() => this.deposit()}>Deposit</button>
                    </div>
                    <div class="cb-student-account-monetary-item-container">
                        <input id="cb-student-account-withdraw-input" type="number" min="0" @input=${(e: any) => this.withdrawInputChanged(e)} .value=${localState.withdrawInputValue} class="cb-student-account-monetary-input">
                        <button class="cb-student-account-monetary-button" @click=${() => this.withdraw()}>Withdraw</button>
                    </div>
                </div>
            </div>
        `;
    }
}

window.customElements.define('cb-student-account', CBStudentAccount);