import { Directive, ElementRef, OnInit, HostListener, Input } from "@angular/core";

@Directive({
    selector: '[EV]'
})


export class EasyValidation implements OnInit {
    static EVErrorsList: EVError[] = [];
    static EVElements: HTMLInputElement[] = [];
    @Input() EVTarget: HTMLElement = undefined;
    @Input() EVType: string;
    @Input() EVErrorMessage: string;
    @Input() EVOnSuccess: (success) => void;
    @Input() EVOnError: (error: EVError) => void;
    @Input() EVSubmit: () => void;

    public EVTypes: EVBase[] = [new EVTEmail()];

    constructor(private el: ElementRef) { }

    public static hasErrors(): boolean {
        for (const iterator of EasyValidation.EVErrorsList) {
            if (iterator.EVErrorMessages.length > 0) {
                return true;
            }
        }
        return false;
    }

    @HostListener('click')
    public OnClick() {
        if (this.el.nativeElement instanceof HTMLButtonElement) {
                if (this.EVSubmit !== undefined) {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                EasyValidation.EVElements.forEach(element => {
                    element.dispatchEvent(evt);
                });
                if (!EasyValidation.hasErrors())
                    this.EVSubmit();
            }
        }
    }

    ngOnInit(): void {
        EasyValidation.EVErrorsList = [];
        this.StoreOnChange();
    }

    private StoreOnChange() {
        if (this.el.nativeElement instanceof HTMLInputElement) {
            EasyValidation.EVElements.push(this.el.nativeElement);
        }
    }

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
        T.ClearErrors(all_errors);
        T.SaveErrors(all_errors);
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

    private GetEVType(): EVBase {
        for (const t of this.EVTypes) {
            if (t.type === this.EVType) {
                return t;
            }
        }
        throw new Error("Easy Validation : Type " + this.EVType + " does not exist. Did you create it and add it to the EVTypes array?");
    }
}

export interface EVType {
    type: string;
    requirements: { (obj: any): string }[];
}

export class EVBase implements EVType {

    private errorList: string[];

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
        newNode.innerHTML = newNode.innerHTML.trim();
        target.appendChild(newNode);
    }

    type: string = undefined;
    requirements: ((obj: any) => string)[] = [];

    ClearErrors(errors: EVError) {
        for (let i = 0; i < EasyValidation.EVErrorsList.length; i++) {
            if (EasyValidation.EVErrorsList[i].EVType === errors.EVType) {
                EasyValidation.EVErrorsList.splice(i, 1);
                i--;
            }
        }
    }
    SaveErrors(errors: EVError) {
        EasyValidation.EVErrorsList.push(errors);
    }
}

export class EVTEmail extends EVBase {

    constructor() {
        super();
    }

    type = "EVEmail";

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
}

export interface EVError {
    EVType: string;
    EVErrorMessages: string[];
}
