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

type State = {
    readonly studentGroupId: string | null;
    readonly studentGroups: Readonly<StudentGroups>;
    readonly studentAccounts: Readonly<StudentAccounts>;
};

const InitialState: Readonly<State> = {
    studentGroupId: null,
    studentGroups: GlobalStore.getState().studentGroups,
    studentAccounts: GlobalStore.getState().studentAccounts
};

class CBStudentGroup extends HTMLElement {

    readonly store = (() => {
        GlobalStore.subscribe(() => {
            this.store.studentGroups = GlobalStore.getState().studentGroups;
            this.store.studentAccounts = GlobalStore.getState().studentAccounts;
        });

        return createObjectStore(InitialState, (state: Readonly<State>) => {
            litRender(this.render(state), this);
        }, this);
    })();

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
                    name: `Test${new Date()}`,
                    studentGroupId: this.store.getState().studentGroupId
                });
            });
        });
    }

    render(state: Readonly<State>): Readonly<TemplateResult> {

        const studentGroup: Readonly<StudentGroup> | undefined = state.studentGroups[state.studentGroupId];

        if (studentGroup === undefined) {
            return html`<div>Loading...</div>`;
        }

        const studentAccounts: ReadonlyArray<StudentAccount> = Object.values(state.studentAccounts).filter((studentAccount: Readonly<StudentAccount>) => {
            return studentAccount.studentGroupId === studentGroup.id;
        });

        return html`
            <h1>Class</h1>

            <h2>${studentGroup.name}</h2>

            <h3>Accounts</h3>
            
            <br>

            <div>
                <button @click=${() => this.scanNewAccount()}>Scan new account</button>
            </div>

            <br>

            <div>
                ${studentAccounts.map((studentAccount: Readonly<StudentAccount>) => {
                    return html`<div style="padding: 5px; cursor: pointer" @click=${() => navigate(`/student-account?studentAccountId=${studentAccount.id}`)}>${studentAccount.id}</div>`;
                })}
            </div>

            <div id="barcode-target"></div>
        `;
    }
}

window.customElements.define('cb-student-group', CBStudentGroup);