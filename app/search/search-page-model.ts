import { EventData, Observable, PropertyChangeData  } from "tns-core-modules/data/observable";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { TextField } from "tns-core-modules/ui/text-field";
import { QuestionService } from "~/services/question.service";
import { QuestionUtil } from "~/services/question.util";
import { QuizUtil } from "~/shared/quiz.util";
import { ObservableProperty } from "../shared/observable-property-decorator";
import { IQuestion } from "../shared/questions.model";

export class SearchPageModel extends Observable {

    @ObservableProperty() searchPhrase: string = "";

    private readonly ALL: string = "All";
    private _searching: boolean = true;
    private _textField: TextField;

    get size() {
        return this._size;
    }

    get questions() {
        return this._questions;
    }

    private _questions: Array<IQuestion> = [];
    private allQuestions: Array<IQuestion>;
    private _size: number;

    constructor() {
        super();
        this.allQuestions = QuestionService.getInstance().readQuestions();
        this.on(Observable.propertyChangeEvent, (propertyChangeData: PropertyChangeData) => {
            if (propertyChangeData.propertyName === "searchPhrase") {
                this.refilter();
            }
        });
    }

    onSearchSubmit(args): void {
        this.refilter();
        const searchBar = <SearchBar>args.object;
        searchBar.dismissSoftInput();
    }

    textFieldLoaded(args): void {
        this._textField = <TextField>args.object;
        // this.hideKeyboard();
    }

    clear(): void {
        this._questions = [];
    }

    refilter() {
        const f = this.searchPhrase.trim().toLowerCase();
        if (f.length > 2) {
            this._questions = this.allQuestions.filter((q) => q.description.toLowerCase().includes(f)
                || q.options.filter((o) => o.description && o.description.toLowerCase().includes(f)).length > 0
                || q.explanation.toLowerCase().includes(f)).slice(0, 20);
            this._questions.forEach((q) => {QuestionUtil.removeOptionTagFromDescription(q); });
            this.publish();
        }
    }

    get searching() {
        return this._searching;
    }

    toggleSearch(): void {
        this._searching = !this._searching;
        this.publish();
    }

    private publish() {
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "questions",
            value: this._questions
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "size",
            value: this._size
        });
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: "searching",
            value: this._searching
        });
    }
}
