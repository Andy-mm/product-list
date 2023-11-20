import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    selectedProductId: string | null = null;

    addFlag$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    editFlag$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    addButtonClicked(): void {
        this.addFlag$.next(true);
    }

    editButtonClicked(): void {
        this.editFlag$.next(true);
    }

    addFormClosed(): void {
        console.log('cl')
        this.addFlag$.next(false);
    }

    editFormClosed(): void {
        this.selectedProductId = null;
    }
}
