import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { AndroidActivityBackPressedEventData, AndroidApplication } from "@nativescript/core/application";
import { EventData, Observable } from "@nativescript/core/data/observable";
import { isAndroid } from "@nativescript/core/platform";
import { topmost } from "@nativescript/core/ui/frame";
import { Label } from "@nativescript/core/ui/label";
import * as ListView from "@nativescript/core/ui/list-view";
import { NavigatedData, Page } from "@nativescript/core/ui/page";
import { QuestionViewModel } from "~/question/question-view-model";
import { SearchPageModel } from "~/search/search-page-model";
import { QuizUtil } from "~/shared/quiz.util";
import { SelectedPageService } from "~/shared/selected-page-service";
import * as navigationModule from "../shared/navigation";

let page: Page;
let vm: SearchPageModel;
let list: ListView.ListView;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    const pg = args.object;
    pg.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    navigationModule.goBack();
    args.cancel = true;
}

export function onNavigatingTo(args: NavigatedData): void {
    page = <Page>args.object;
    list = page.getViewById("listView");
    SelectedPageService.getInstance().updateSelectedPage("search");
    vm = new SearchPageModel();
    page.bindingContext = vm;
}

export function onNavigatedFrom(args): void {
    QuizUtil.hideKeyboard();
}

export function onDrawerButtonTap(args: EventData) {
    QuizUtil.hideKeyboard();
    QuestionViewModel.showDrawer();
}

export function toggleSearch(args: EventData) {
    vm.toggleSearch();
}

export function clear() {
    vm.clear();
}

export function openUrl(arg: EventData) {
    const lbl: Label = arg.object as Label;
    QuizUtil.openUrl(lbl.text);
}
