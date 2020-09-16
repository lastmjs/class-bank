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
import { GlobalState } from '../index.d';

type LocalState = {
};

const InitialLocalState: Readonly<LocalState> = {
};

class CBStudentGroups extends HTMLElement {
    
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
    
    createClass() {
        const name: string = (this.querySelector('#input-class-name') as any).value;

        GlobalStore.dispatch({
            type: 'CREATE_STUDENT_GROUP',
            name
        });
    }

    deleteStudentGroup(e: any, studentGroupId: string) {
        e.stopPropagation();

        const confirmed: boolean = confirm(`Are you sure you want to delete this class?`);

        if (confirmed === true) {
            GlobalStore.dispatch({
                type: 'DELETE_STUDENT_GROUP',
                studentGroupId
            });
        }
    }

    render(
        localState: Readonly<LocalState>,
        globalState: Readonly<GlobalState>
    ): Readonly<TemplateResult> {
        return html`
            <style>

                /* TODO we should probably make this into an element, copied in cb-student-group */
                .cb-student-groups-cards-container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                /* TODO we should probably make this into an element, copied in cb-student-group */
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

                .cb-student-groups-delete-button {
                    font-size: calc(25px + 1vmin);
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
                        ${Object.values(globalState.studentGroups).map((studentGroup: Readonly<StudentGroup>) => {

                            const studentAccountsForStudentGroup: ReadonlyArray<StudentAccount> = Object.values(globalState.studentAccounts).filter((studentAccount: Readonly<StudentAccount>) => {
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
                                    <br>
                                    <button class="cb-student-groups-delete-button" @click=${(e: any) => this.deleteStudentGroup(e, studentGroup.id)}>Delete</button>
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