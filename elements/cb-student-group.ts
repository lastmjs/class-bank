import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import { GlobalStore } from '../state/store';
import {
    StudentGroup,
    StudentAccount,
    StudentGroups,
    StudentAccounts
} from '..';
import Quagga from '../web_modules/quagga.js';
import { navigate } from '../services/utilities';
import { createObjectStore } from 'reduxular';
import { GlobalState } from '../index.d';

type LocalState = {
    readonly studentGroupId: string | null;
};

const InitialLocalState: Readonly<LocalState> = {
    studentGroupId: null
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
        
        if (this.localStore.studentGroupId === studentGroupId) {
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

    // TODO I don't really want the thing to return multiple results, just one, but I'm not sure it's really a problem
    scanNewAccount() {
        Quagga.init({
            inputStream: {
                name: 'Live',
                type: 'LiveStream',
                target: this.querySelector('#barcode-target')
            },
            decoder: {
                readers: ['code_128_reader']
            }
        }, (err) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log('Quagga initialized');
            Quagga.start();

            Quagga.onDetected((data) => {
                Quagga.stop();
                this.querySelector('#barcode-target').innerHTML = ``;
                console.log(data);

                GlobalStore.dispatch({
                    type: 'CREATE_STUDENT_ACCOUNT',
                    id: data.codeResult.code,
                    name: `Test ${new Date().toLocaleDateString()}`,
                    studentGroupId: this.localStore.getState().studentGroupId
                });
            });
        });
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
                        </div>
                    `;
                })}
            </div>

            <div id="barcode-target"></div>
        `;
    }
}

window.customElements.define('cb-student-group', CBStudentGroup);