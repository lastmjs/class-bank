import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import { GlobalStore } from '../state/store';
import {
    StudentGroups,
    StudentGroup,
    StudentAccounts,
    StudentAccount,
    USDCents
} from '..';
import { navigate } from '../services/utilities';
import {
    createObjectStore
} from 'reduxular';

type State = {
    readonly studentGroups: Readonly<StudentGroups>;
    readonly studentAccounts: Readonly<StudentAccounts>;
};

const InitialState: Readonly<State> = {
    studentGroups: GlobalStore.getState().studentGroups,
    studentAccounts: GlobalStore.getState().studentAccounts
};

class CBStudentGroups extends HTMLElement {
    
    readonly store = (() => {

        GlobalStore.subscribe(() => {
            this.store.studentGroups = GlobalStore.getState().studentGroups;
            this.store.studentAccounts = GlobalStore.getState().studentAccounts;
        });

        return createObjectStore(
            InitialState, 
            (state: Readonly<State>) => {
                litRender(this.render(state), this)       
            }, 
            this
        );
    })();
    
    createClass() {
        const name: string = (this.querySelector('#input-class-name') as any).value;

        GlobalStore.dispatch({
            type: 'CREATE_STUDENT_GROUP',
            name
        });
    }

    render(state: Readonly<State>): Readonly<TemplateResult> {
        return html`
            <style>

                .cb-student-groups-cards-container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .cb-student-groups-card {
                    box-shadow: 0px 0px 5px black;
                    padding: calc(5px + 1vmin);
                    cursor: pointer;
                    margin: calc(5px + 1vmin);
                    min-width: 25vw;
                    min-height: 25vh;
                    font-size: calc(25px + 1vmin);
                    border-radius: calc(1px + 1vmin);
                }

                .cb-student-groups-create-container {
                    display: flex;
                    width: 100%;
                }

                .cb-student-groups-create-input {
                    font-size: calc(25px + 1vmin);
                    padding: calc(5px + 1vmin);
                    flex: 1;
                    border-top: none;
                    border-right: none;
                    border-left: none;
                    margin-top: 1vh;
                }

                .cb-student-groups-create-button {
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
            </style>

            <div>
                <div>
                    <div class="cb-student-groups-create-container">
                        <input id="input-class-name" type="text" class="cb-student-groups-create-input" placeholder="New class name">
                    </div>
                    
                    <div style="display: flex">
                        <button @click=${() => this.createClass()} class="cb-student-groups-create-button">Create class</button>
                    </div>
                    
                    <br>

                    <div class="cb-student-groups-cards-container">
                        ${Object.values(state.studentGroups).map((studentGroup: Readonly<StudentGroup>) => {

                            const studentAccountsForStudentGroup: ReadonlyArray<StudentAccount> = Object.values(state.studentAccounts).filter((studentAccount: Readonly<StudentAccount>) => {
                                return studentAccount.studentGroupId === studentGroup.id;
                            });

                            const totalFunds: USDCents = studentAccountsForStudentGroup.reduce((result: USDCents, studentAccount: Readonly<StudentAccount>) => {
                                return result + studentAccount.balance;
                            }, 0);

                            return html`
                                <div class="cb-student-groups-card" @click=${() => navigate(`/student-group?studentGroupId=${studentGroup.id}`)}>
                                    <div>${studentGroup.name}</div>
                                    <br>
                                    <div>Students: ${studentAccountsForStudentGroup.length}</div>
                                    <br>
                                    <div>Funds: $${(totalFunds / 100).toFixed(2)}</div>
                                </div>
                            `;
                        })}
                    </div>
                </div>
            </div>
        `;
    }
}

window.customElements.define('cb-student-groups', CBStudentGroups);