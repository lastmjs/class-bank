import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import { GlobalStore } from '../state/store';
import {
    StudentGroup,
    StudentAccount
} from '..';
import { navigate } from '../services/utilities';
import { createObjectStore } from 'reduxular';
import { GlobalState } from '../index.d';
import './cb-scanner';

type LocalState = {
    readonly studentGroupId: string | null;
    readonly showScanner: boolean;
};

const InitialLocalState: Readonly<LocalState> = {
    studentGroupId: null,
    showScanner: false
};

class CBStudentGroup extends HTMLElement {

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

    set studentGroupId(studentGroupId: string) {
        
        if (
            studentGroupId === null ||
            studentGroupId === undefined ||
            this.localStore.studentGroupId === studentGroupId
        ) {
            this.localStore.studentGroupId = studentGroupId;
            return;
        }

        this.localStore.studentGroupId = studentGroupId;

        const studentGroup: Readonly<StudentGroup> = GlobalStore.getState().studentGroups[studentGroupId];

        // TODO figure out why we have to throw this on the event loop to stop from overflowing the call stack
        // TODO seems like this.localStore.studentGroupId is not updating correctly
        setTimeout(() => {
            GlobalStore.dispatch({
                type: 'SET_TOP_BAR_TEXT',
                topBarText: `${studentGroup.name}`
            });
        });
    }

    scanNewAccount() {
        this.localStore.showScanner = true;
    }

    scanNewAccountCompleted(e: any) {
        this.localStore.showScanner = false;

        GlobalStore.dispatch({
            type: 'CREATE_STUDENT_ACCOUNT',
            id: e.detail,
            name: '',
            studentGroupId: this.localStore.getState().studentGroupId
        });
    }

    scanNewAccountCanceled() {
        this.localStore.showScanner = false;
    }

    render(
        localState: Readonly<LocalState>,
        globalState: Readonly<GlobalState>
    ): Readonly<TemplateResult> {

        const studentGroup: Readonly<StudentGroup> | undefined = globalState.studentGroups[localState.studentGroupId];

        if (studentGroup === undefined) {
            return html`<div>Loading...</div>`;
        }

        const studentAccounts: ReadonlyArray<StudentAccount> = Object.values(globalState.studentAccounts).filter((studentAccount: Readonly<StudentAccount>) => {
            return studentAccount.studentGroupId === studentGroup.id;
        });

        return html`
            <style>
                .cb-student-group-scan-button {
                    background-color: white;
                    cursor: pointer;
                    font-size: calc(25px + 1vmin);
                    border: none;
                    box-shadow: 0px 0px 5px black;
                    padding: calc(5px + 1vmin);
                    margin-left: auto;
                    margin-top: calc(5px + 1vmin);
                    margin-right: calc(5px + 1vmin);
                }


                /* TODO we should probably make this into an element, copied in cb-student-group */
                .cb-student-group-cards-container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                /* TODO we should probably make this into an element, copied in cb-student-group */
                .cb-student-group-card {
                    box-shadow: 0px 0px 5px black;
                    padding: calc(5px + 1vmin);
                    cursor: pointer;
                    margin: calc(5px + 1vmin);
                    min-width: 25vw;
                    min-height: 25vh;
                    font-size: calc(25px + 1vmin);
                    border-radius: calc(1px + 1vmin);
                }

            </style>

            <div style="display: flex">
                <button @click=${() => this.scanNewAccount()} class="cb-student-group-scan-button">Scan new account</button>
            </div>

            <br>

            <div class="cb-student-groups-cards-container">
                ${studentAccounts.map((studentAccount: Readonly<StudentAccount>) => {
                    return html`
                        <div
                            class="cb-student-groups-card"
                            @click=${() => navigate(`/student-account?studentAccountId=${studentAccount.id}`)}
                        >
                            <div>${studentAccount.id}</div>

                            <br>

                            <div>${studentAccount.name}</div>

                            <br>

                            <div>Balance: $${(studentAccount.balance / 100).toFixed(2)}</div>
                        </div>
                    `;
                })}
            </div>

            ${localState.showScanner ? html`
                <cb-scanner
                    @scan-completed=${(e: any) => this.scanNewAccountCompleted(e)}
                    @scan-canceled=${() => this.scanNewAccountCanceled()}
                ></cb-scanner>
            ` : ''}
        `;
    }
}

window.customElements.define('cb-student-group', CBStudentGroup);