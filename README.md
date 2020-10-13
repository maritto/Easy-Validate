# Easy-Validate
Validate fields easily in angular


USAGE
	[EV]  //Use EasyValidation directive.
	[EVType]="'EVEmail'"  //class name as string that represents the type of data to be entered.
		TYPES OF DATA AVAILABLE
			-> EVEmail : Verifies if it is a valid Email
			***MORE TO BE ADDED**
	[EVTarget]="targetToDisplayErrorAt" //HtmlElement -> will create a span inside with the error.
	[EVOnSuccess]="callback" //Argument passed is the value inserted.
	[EVOnError]="Callback"  //Argument passed is an EVError 

Usage example:

[HTML]

  <input type="text" EV [EVTarget]="imthetarget" [EVType]="'EVEmail'" [EVOnError]="ShowAlertWithError" [EVOnSuccess]="ShowAlertFieldValue"> 
  <div #imthetarget></div>
  
[TypeScript]

	public ShowAlertWithError(ev_error){
		alert(ev_error);
	}
	public ShowAlertFieldValue(succeeded)
	{
		alert(succeeded);
	}
	
	
To add custom fields
**TODO: ADD EXAMPLE**
