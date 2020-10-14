# Easy-Validate  
Validate fields easily in angular  
  
  
#### Options  
|Attribute|Description| Parameters| Returns |
| ------ | ------ | ------ | ------ |
| [EV] | Use EasyValidation directive. |
| [EVType]="'EVEmail'" | Indicate what are you are validating. | **<string>** that represents the type of data expected.  |
|[EVTarget]="targetToDisplayErrorAt" | Indicate where you want to display the error | **<HTMLElement>** where you want to display the error. Preferably a **<span>** as the element is not hidden while empty. |
|[EVOnSuccess]="callback" | Calls a function when the field is validated successfully. |   | Returns the value inserted by the user as **<string>**  into the callback function. |
|[EVOnError]="callback"  |  Calls a function when the field is validated insuccessfully.  | | Returns an **<EVError>** with the errors into the callback function.|
| [EVSubmit]="validNowDoSomething" | Calls a function when all fields are valid and the user presses an assigned **<HTMLButtonElement>** | |

#### Other Options  
|Property |Description| Parameters| Returns |
| ------ | ------ | ------ | ------ |
| EasyValidation.EVErrorsList | Variable that contains all the errors.|
|EVElements| Variable that contains all the **<HTMLInputElement>** that were assigned a validation rule.



### TYPES OF DATA AVAILABLE  
|Attribute|Description|
| ------ | ------ |
|EVEmail | Verifies if it is a valid Email |
||		***MORE TO BE ADDED**  |
  
# Usage example:  

#### [TypeScript]
``` TYPESCRIPT
@NgModule({
  declarations: [
    EasyValidation
  ],
  (...)
```

#### [HTML]
```  HTML
<input type="text" EV [EVTarget]="imthetarget" [EVType]="'EVEmail'" [EVOnError]="ShowAlertWithError" [EVOnSuccess]="ShowAlertFieldValue">   
<div #imthetarget></div>  
<button EV [EVSubmit]="SuccessfullTest">CLICK</button>
```
#### [TypeScript]
``` TYPESCRIPT
public ShowAlertWithError(ev_error){  
	alert(ev_error);  
}  
public ShowAlertFieldValue(succeeded)  
{  
	alert(succeeded);    
}
public SuccessfullTest(){
    alert("I could do a request to the server and all my fields are valid at this point.")
}
```

# To add custom fields  
**TODO: ADD EXAMPLE**
  
