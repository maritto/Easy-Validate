import { unescapeIdentifier } from '@angular/compiler';
import { Directive, ElementRef, HostListener, Input } from "@angular/core";
import { element } from 'protractor';

@Directive({
    selector: '[EV]'
})

export class EasyValidation {

    /*USAGE
    [EV]  //Use EasyValidation directive.
    [EVType]="'EVEmail'"  //class name as string that represents the type of data to be entered.
            //TYPES OF DATA AVAILABLE
                    -> EVEmail : Verifies if it is a valid Email.
    [EVTarget]="targetToDisplayErrorAt"
    [EVOnSuccess]="callback" //Argument passed is the value inserted.
    [EVOnError]="Callback"  //Argument passed is an EVError 
    */

    @Input() EVTarget: HTMLElement = undefined;
    @Input() EVType: string;
    @Input() EVErrorMessage: string;
    @Input() EVOnSuccess: (success) => void;
    @Input() EVOnError: (error: EVError) => void;

    private _EVEmail = new EVTEmail();
    public get EVEmail() {
        return this._EVEmail;
    }

    public EVTypes: EVType[] = [new EVTEmail()];

    constructor(private el: ElementRef) { }

    @HostListener('change')
    public Verify() {
        let T = this.GetEVType();
        let all_errors: EVError = { EVType: T.type, EVErrorMessages: [] };
        all_errors.EVType = T.type;
        T.requirements.forEach(element => {
            let tmpError: string = element(this.el.nativeElement);
            if (tmpError !== undefined) {
                all_errors.EVErrorMessages.push(tmpError);
            }
        });
        if (this.EVOnError !== undefined && all_errors.EVErrorMessages !== undefined && all_errors.EVErrorMessages.length > 0) {
            this.EVOnError(all_errors);
        }
        if (this.EVOnSuccess !== undefined) {
            this.EVOnSuccess(this.el.nativeElement.value);
        }
        if (this.EVTarget !== undefined) {
            T.ClearTargetDisplay(this.EVTarget);
        }
        if (this.EVTarget !== undefined) {
            T.DisplayErrors(all_errors, this.EVTarget);
        }
    }

    private GetEVType(): EVType {
        for (const t of this.EVTypes) {
            if (t.type === this.EVType) {
                return t;
            }
        }
        throw new Error("Easy Validation : Type " + this.EVType + " does not exist. Did you create it and add it to the EVTypes array?");
    }
}

export interface EVType {
    ClearTargetDisplay: (target: HTMLElement) => void;
    DisplayErrors(all_errors: EVError, target: HTMLElement);
    type: string;
    requirements: { (obj: any): string }[];
    HandleErrors: (errors: string[]) => void;
}

export class EVTEmail implements EVType {

    ClearTargetDisplay(target: HTMLElement) {
        while (target.hasChildNodes()) {
            target.removeChild(target.children[0]);
        }
    }

    DisplayErrors(all_errors: EVError, target: HTMLElement) {
        let newNode = document.createElement("SPAN");
        newNode.innerHTML = "";
        all_errors.EVErrorMessages.forEach((value) => {
            newNode.innerHTML += value + "\n";
        });
        newNode.innerHTML = newNode.innerHTML.trimEnd()
        target.appendChild(newNode);
    }

    public type: string = "EVEmail";

    private _errors: string[];
    public get errors(): string[] {
        return this._errors;
    }

    public requirements: ((obj: any) => string)[] = [
        (natEl) => {
            let pat: RegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return pat.test(<string>natEl.value) ? undefined : "Not a valid email address.";
        }
    ];
    public HandleErrors: (errors: string[]) => void = (err) => {
        this._errors = err;
    };
}

export interface EVError {
    EVType: string;
    EVErrorMessages: string[];
}