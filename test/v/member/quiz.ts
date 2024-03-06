import {view} from '../../../outlook/v/code/view.js'
//
import {mutall_error,fuel} from "../../../schema/v/code/schema.js";

//
//The general definition of a group of user inputs is characterised by the 
//'type' keyword, as a discriminant. This construct allows us to design forms for 
//collecting sophisticated data, Z, defined below:-
/*
type Z = A|B|C

where

A extends discriminant{...}
B extends discriminant{...}
C extends discriminant{...}
 
*/
export interface discriminant {
    //
    //The discriminant key
    type:string;
  }

  //Dirt is any value, excluding undefined
export type dirt = Exclude<any, undefined>;

//Clean is dirt without errors
export type clean = Exclude<dirt, Error>;

//The key of i is the string version of the i indexer, thus excluding number 
//and Symbol
export type key<i> = Extract<keyof i, string>;

  //The (possibly erroenous) user inputs for some clean data type, x, is defined 
//as follows:- 
export type dirty<x> =
    //
    //If the clean version, x, is a group, then its raw version is the same as x
    //with all the key values converted to raw (except the discriminant, key, 
    //'type'. The raw data may involve all or some of the keys of x
    //
    //If the clean version, x, is a discriminant, then its raw version is...
    x extends discriminant
    //
    //...a similar discriminant with the following prperties:-
    ? { 
        [key in keyof x]:
        //
        //The key's value depends on its type.     
        key extends 'type'
            //
            //If the type key is the discriminant, then is not part of the inputs
            //to be captured by the user.
            ? x[key]
            //
            //If tthe key is anythng else then it is candidate for user inputs
            //and therefore can be dirty
            : dirty<x[key]>
    }
    //
    //...the desired data, x, with an error possibility or null. 
    :x|Error|null
//Quiz is an abstract class that helps to collect data of any type <i> thru
//some dirty version to the final version of type <i>
//The user must implement the following methods:-
//- populate: fills a dialog box with inputs on load
//- read: extracts the user modified inputs for
//- execute: uses the inputs to execute a save-like operation, e.g., writing 
//to a database, effecting registration, etc.
//The main public methods are:-
//- administer: collects inputs from user
export abstract class quiz<i> extends view{
    //
    //The element that represents the visual dimension of the class
    protected proxy:HTMLElement;
    //
    constructor(
        //
        //The html code needed for constructing a quiz, if any. If not 
        //provided the user can programmaticaly provide the code by
        //overriding the populate method. The mashamba project is a case in point
        public url?:string
        
    ){
        //
        super(url);
        //
        //The proxy for this page is the document's body
        this.proxy = this.document.body;
         
    }
    //
    //Fill the quiz page with the given data, typically obtained from a database
    //This section is particularly useful in cases of modification of data. 
    //The user can override this method to present the data differently.
    abstract populate():void;
    //
    //Read is the opposite of populate; it and returns the dirty version of
    //of the desired date, i. The check operaton implemented in the quiz class
    //handles teh error reporting before handing the cleaned version for execute
    abstract read():dirty<i>;
    
    //Reports an arroer that is targeted at a specifific input element on the form
    //detailed error
    abstract report_targeted_error(key:keyof dirty<i>, error:Error):undefined;
    
    //Run the process that led to the data collection in the first place. 
    //Doing it here means that we still have access to the dialog box that was 
    //used for data collection so that if the execute fails we can edit the data 
    //and re-execute it. Here are 2 examples of execute:-
    //-- saving the data to a database
    //-- performing a user authentication
    //The execution may result in errors; it is succcessful if none
    abstract execute(input:i):Promise<Array<Error>>;
    //
    //This method coordinates all data collection and processing activities. It shows the 
    //dialog waits for the user to initiate a process after data entry and depending
    //on the process selected by the user the data enterd is retrieved from the form
    //validation checks are done to ensure the quality of the data collected then
    //fainally the process that the user selectd is undertaken returning the collected
    //data upon succes and closing the data collection dialog
    public async administer():Promise<i|undefined>{
        //
        //Show the dialog (there may be a need to fetch a url from the server)
        const {submit, cancel} =  await this.open();
        //
        //Wait for the user to click either save or cancel button and when they 
        //do return the imagery or undefined(JM,SW,JK,GK,GM)
        const result: i|undefined = await this.get_user_response(submit, cancel);
        //
        return result;
    }
    //
    //Show the dialog (there may be a need to fetch a url from the server)
    //This proceeds by attaching the form fragment to the dialog box and populate the 
    //form in case of data modification. Then show the box to enable data entry
    protected async open():Promise<{submit:HTMLElement, cancel:HTMLElement}>{
        //
        //If the url is provided, use it to show the dialog box 
        if (this.url) await this.show(this.url);
        //
        //Paint the dialog box to refelect the user's wish
        this.populate();
                //
        //Return the submit and cancel buttons as required by this method. 
        //Consider constructing them if they are not available
        return {submit:this.get_element('submit'), cancel:this.get_element('cancel')}        
    }

    //Use the given url to show this dialog box
    private async show(url:string):Promise<void>{
        //
        //Request for the content of the file specified by the path 
        const response: Response = await fetch(url); 
        //
        //Abort his procedure if there was an error in server-client 
        //communication 
        if (!response.ok) throw new mutall_error(
            `Fetching '${url}' failled with status code '${response.status}'.<br/> 
            The status text is '${response.statusText}'`
        );
        //
        //Append the string to the html of the dialog
        this.proxy.innerHTML = await response.text();
        //
        //Get whatever form was appended to the dialog
        const form = this.proxy.querySelector("form");
        //
        //Prevent the default submit behaviour of the form if present
        if(form) form.onsubmit = (e) => e.preventDefault();
    }
    
    //
    //We wait for the user to enter the data that is required in the form; then  
    //initate either one of the following two processes:-
    //1. submit or
    //2. cancel
    //Based on the user selected process we perform relevant actions
    protected get_user_response(submit:HTMLElement, cancel:HTMLElement): Promise<i| undefined> {
        //
        //Wait for the user to enter data and initiate the desired process
        return new Promise((resolve) => {
            //
            //After entering input details the user can either
            //
            // ...submit the data
            submit.onclick = async () => await this.submit(resolve);
            //
            // ... or terminate the process by canceling
            cancel.onclick = () => resolve(undefined);
        });
    }
    //
    //On submit we collect the data that the user entered in the form then save
    // it considering:-
    //--the different sources of the data 
    //--the need for pinpointed error reporting
    //--the need for resolving the promised data upon succesful saving.
    public async submit(resolve:(result:i)=>void):Promise<void>{
        //
        //Retrieve the information that was entered by the user (with all its 
        //possible errors)
        const input:dirty<i> = this.read();
        //
        //Check the raw data for errors, reporting them if any 
        const output:i|undefined = this.check(input);
        //
        //Continue only of there were no errors. Note the explicit use of '===', 
        //just incase the output was a boolean value
        if (output===undefined) return; 
        //
        //Use the data to execute a user defined operation, e.g., saving the data
        //to a database, authorization, etc. 
        const errors: Array<Error> = await this.execute(output);
        //
        //Resolve the promised data if the execute operation was succesful. Do
        //not report the error as this may be a repetition
        if (errors.length === 0) resolve(output);
        //
        //Otherwise report the errors in the more general area
        else this.report_errors(errors); 
    }

    //Report errors that don't target a specific field
    report_errors(errors:Array<Error>):void{
        //
        //Get the general error reporting element, if any; otherwise create one
        const report:HTMLElement = 
            this.document.getElementById('report')
            ?? this.create_element('div', this.proxy, {className:'error'});
        //
        //Style the error in a detail summary arrangement
        const style = (error:Error)=>`
            <details>
                <summary>
                    ${error.name}: ${error.message}
                </summary>
                    ${error.stack ?? ''}
            </details>
        `;    
        //
        //Style the errors with a line break separator
        report.innerHTML = errors.map(error=>style(error)).join("<br/>");
    }

    //Check the raw data for errors, returning with the clean data if there 
    //is none or void if there are. The errors are reported in a key-targeted 
    //fashion -- thus giving the user a better error handling experience than 
    //the common (simpler) practice
    check(input:dirty<i>):i|undefined{
        //
        //If input is not a diacriminant then deal with it 
        if (!this.is_discriminant(input)) return this.check_simple_input(input);
        //
        //This is a discriminat. Cjeck  everyone of its keys 
        //
        //Isolate the all the dirt  keys. N.B. Object keys are always strings.
        //Coerce them to the correct type (so that the next filtering can use
        //the correct data types). Also, the data type for keyof is  
        //string|null|Symbol. Its the string we want.
        const keys = Object.keys(input) as Array<keyof dirty<i>>;
        //
        //Select the keys with erroneous values
        const err_keys = keys.filter(key => input[key] instanceof Error);
        //
        //If errors are found, report them to the user and discontinue this 
        //check with an undefined result
        if (err_keys.length>0){
            //
            //Report the errors
            err_keys.forEach(key=>{
                //
                //Get the k'th value; it must be an error because filtering 
                //ensured so. 
                const error = <Error>input[key];
                //
                //Report the error message targeting the key's place holder. 
                this.report_targeted_error(key, error);
            });
            //
            //There are errors in the raw data, so return the result as undefined
            //(as opposed to clean data)   
            return undefined;
        }
        //If the user needs additional checks, the this stub is provided for this
        //purpose
        //const x:Ifuel|undefined = this.oncheck(input)
        //
        //There are no errors in the user inputs. Return the result as the clean 
        //data. The unkknown conversion is a suggestion by Intellisense
        return input as i;
    }

    //Checks if the given input is a discriminant or not
    is_discriminant(input:any): input is discriminant{
        //
        //An input is a discriminant if it has a key called type, and whose
        //data type is the discriminating string. 
        return input.type && typeof input.type==='string';
    }

    //Check a simple input.
    check_simple_input(input:any):any{
        //
        //If the input is not an error, return it;
        if (!(input instanceof Error)) return input;
        //
        //Thow the error. Simple cases are not yest considered
        throw new mutall_error(String(input));
    }

    //
    //Clear the shared error reporting placeholder. The holder is created if not
    //provided for
    public clear_errors():void{
        //
        //Get report placeholder...
        const holder:HTMLElement = 
            //
            //...that exists
            this.document.getElementById('report')
            //
            //...or create a new one at the end of the body
            ?? this.create_element('div', this.document.body, {id:'report'});
        //
        //Clear it
        holder.innerHTML="";    
    }      
    
}

