import {column, mutall_error} from "../../../schema/v/code/schema.js";
import {view} from "../../../outlook/v/code/view.js";
import {label} from "../../../schema/v/code/questionnaire.js";
import {upload_files} from "../../../schema/v/code/server.js";
import {dirt, clean} from "./quiz.js";

//These intefaces are designed to allow users to supply different options for
//creating ios
export namespace option{

    export interface io{
        name:string;
        col:column;
        required:boolean;
        //
        //The raw value that can be handded by an io
        value:dirt;
        //
        //Place holder for reporting errors
        reporter:HTMLElement;
    }

    //Single value io
    export interface single extends io{
        element:HTMLInputElement;
    }

    //Multi-value ios
    export interface multiple extends io{
        type:'checkbox'|'radio';
        elements:Array<HTMLInputElement>
    }
    
    export interface input extends single{
        type:'number'|'string'//See HTLM data types
        maxlen:number;
        size:number
    }

    export interface file extends single{
        //
        //where to save the file on the server
        destination:string
    }

    export interface image extends file{
        preview:HTMLImageElement;
    }

    //Requirements for an anchor element
    export interface url extends io{
        a:HTMLAnchorElement;
        href:HTMLInputElement;
        textContent:HTMLInputElement;
    }

    
}

export abstract class io extends view{
    //
    //All ios have a place holder for errors. If defined, it its the value for
    //the io, othersise the value is io-specific
    public error?:Error;
    //
    //
    //An io must have a proxy -- the html eleent that repsesents the visual aspect
    //of the io
    //For now make everything mandatory; then relax the requirement to reflect 
    //the reality. Name and column are not needed to for an io, but if you need
    //them, you have to make sure they are provided. 
    constructor(public proxy:HTMLElement, public option?:Partial<option.io>){
        super();
    }
    //
    //Returns and sets io-specific clean value. A clean value has no error
    abstract get_value():clean;
    abstract set_value(value:clean):void;
    
    //Returns 1 and only 1 element that matches the given css, searching from
    //the given reference element
    static get_unique(ref:HTMLElement, css:string):HTMLElement{
        //
        //Get all tha nodes that satisfy the css
        const list:NodeList  = ref.querySelectorAll(css);
        //
        //Get its length
        const len:number = list.length;
        //
        //There must me one node.
        if (len===0) 
            throw new mutall_error(`There is no node under the current reference that matches css '${css}'`);
        //
        //There cannot be more than 1
        if (len>1)
            throw new mutall_error(`Only 1 node is expected under the current reference that matches css '${css}'. '${len}' were found`);
        //
        //Get the only node
        const node:Node = list.item(0)!;
        //
        //The node must be a html element
        if (!(node instanceof HTMLElement))  
            throw new mutall_error(`The node retrieved by css '${css}' is not a HTML element`);
        //
        //Return the only HTML node
        return node;
    }

    //Search the surrounding and return the database column name of an io. It is
    //an error if it cannot be found
    get cname():string{
        //
        //Search html for the closest for a database column cname
        const found:HTMLElement| null= this.proxy.closest('*[data-cname]');
        if (found && found.dataset.cname) return found.dataset.cname;
        //
        //If no optiona are available, then return the column's name
        if (!this.option) return this.name;
        //
        //Return the name if a database column is an input option
        if (this.option.col) return this.option.col.name;
        //
        //As a last resort, return the field name of this io as thedatabase
        //columns name
        return this.name   
    }

    //Search the surrounding and return the database table, i.e., entit, name 
    //of an io. It is an error if it cannot be found.
    get ename():string{
        //
        //Search the current html document for the closest entity name
        const found:HTMLElement| null= this.proxy.closest('*[data-ename]');
        if (found && found.dataset.ename) return found.dataset.ename;
        //
        //Return the entity name of a database column if it is among the optiona
        if (this.option?.col) return this.option.col.entity.name;
        //
        //There is not enough data available for determininh the name of the
        //entity to be associated with this io
        throw new mutall_error(`Unable to find an entity name for this io`, this);   
    }

    //
    //An io has a value, that can be anything, including error.
    get value(): dirt{
        //
        //If the error is set, then its the value. As soon as a user initiates
        //an input, the error flag is set to undefined
        if (this.error) return this.error;
        //
        //Return io-specific value
        const v:dirt = this.get_value();
        //
        //If the a requierd value is null then return it as an error
        if (v===null && this.required) return new Error('This value is required');
        //
        return v;
    }

    //The value of any io is an error, if the error property is set.
    set value(i:dirt){
        //
        //If the input is an error, report it
        if (i instanceof Error) {
            //
            //Save the error message
            this.error = i;
            //
            //report the error message
            this.reporter.textContent = i.message;
            //
            return;
        }
        //Clear the error flag, if necessary
        if (this.error) this.error=undefined;      
        //
        //Set the clean version of value
        this.set_value(i);   
    }    



    //Determine if the value of this io is requirted or not
    get required():boolean{
        //
        //Search the current html document for the closest entity name
        //Look around the html/dom environment to see  whether that value
        //is required. For instance, if an input element asociated with this io
        //is required, then it is required. If the data field associated with this
        //io has a data-required attribute, then it is required.
        
        const found:HTMLElement| null= this.proxy.closest('*[data-required]');
        if (found && found.dataset.required) return true;
        //
        //The default is that an io is not required
        return false;

    }

    get name():string{
        //
        if (this.option?.name) return  this.option.name;
        //
        //Place code for alternative ways of determining name here
        //
        //Last resort
        throw new mutall_error(`The name of this io is not defined`)
    }

    get col():column{
        //
        if (this.option?.col) return  this.option.col; 
        throw new mutall_error(`Column ${this.name} is not defined`); 
    }

    //Get the element used for reporting errors in a targeted fashion
    get reporter():HTMLElement{
        //
        //Check the options
        if (this.option?.reporter) return  this.option.reporter;
        //
        //Try other more advanced methods
        // 
        //If you get here, you failed to get a report
        throw new mutall_error(`Error reporting placeholder is not found`);
    }
    

    //Yields questionnaire labels associate with this io
    *collect_label():Generator<label>{
        //
        //Request for a questionnare label from an erroneous io is an error
        if (this.value instanceof Error)
            throw new mutall_error(`Unable to collect labels from this io`, this);
        //
        //Collect the minimum version of a valid label
        const result:label = [
            this.value, 
            this.cname,  
            this.ename, 
        ];
        yield result;
    } 

    //On changing an io, its error is cleared.
    onchange():void{
        //
        //Clear the error message report
        this.reporter.textContent = ""; 
    }

    //Show teh error message. N.B. report_error() is a view level method
    show_error(error:Error){
        //
        //Get the general error reporting element, if any; otherwise create one
        const report:HTMLElement = 
            this.proxy.querySelector('.error')
            ?? this.create_element('div', this.proxy, {className:'error'});
        //
        //Insert the error message
        report.innerHTML =error.message;
    }

}

//Modelling an input element.
export class input extends io{
    //
    constructor(proxy:HTMLElement, public option:Partial<option.input>){
        super(proxy, option);
    }

    //The input eleent itself
    get element():HTMLInputElement{
        //
        if (this.option.element) return  this.option.element;
        //
        //Place code for alternative ways of determining name here
        //
        //Last resort
        throw new mutall_error(`Input element not found`);
    }

    //Returns input specific value, taking care of spaces
    get_value():clean{
        //
        //Remove trailing spaces
        const value:string = this.element.value.trim();
        //
        //Return the value if it is not empty, otherwise the value
        return value=='' ? null : value;
    }

    //Sets an input value, taking care of null and fileList case. N.B. The error
    // value has been taken care of at the io level
    set_value(value:clean){
        //
        //An null value is is translated to a space 
        if (value===null) {this.element.value=''; return;}
        //
        //Any other value should be converted to a string for setting
        this.element.value = String(value);
    }
}

//Modelling multiple choices
export abstract class choices extends io{
    //
    constructor(proxy:HTMLElement, public option:Partial<option.multiple>){
        super(proxy, option);
         
    }

    //Returns the multiple choice elements
    get elements():Array<HTMLInputElement>{
        //
        if (this.option.elements) return  this.option.elements;
        //
        //Place code for alternative ways of determining the choices here
        //
        //Action of the last resort
        throw new mutall_error(`Multiple choice elements not found`);
    }

    get required():boolean{
        //
        //Get the first element that is marked as required. Only one need be so
        const found:Element|undefined = this.elements.find(element=>element.required);
        //
        //If no element found requred then the value is not required
        return found===undefined ? false: true;
    } 
    
    //
    //Set this set of check boxes to the values that match the given input. 
    //This means converting the input string value to a list that is used for
    //checking appropriate matching boxes.
    set_value(value:clean):void{
        //
        //If the clean value is null then uncheck all the boxes
        if (value===null) {
            this.elements.forEach(element=>element.checked=false);
            return;
        }
        //
        //Any other value will be reported as an error
        throw new mutall_error(`Unable to set this value, '${value}'`, value);
    }

    //
    //Given the string value, check the matching box or boxes 
    abstract set_choices(value:string):void;
    //
    //Match the given option to any of this choices elements
    match(choice:string):void{
        //
        //Get the first element that matches the choice
        const found:HTMLInputElement|undefined = this.elements.find(element=>element.value===choice);
        //
        //Its an error if the choice cannot be found
        if (!found) throw new mutall_error(`This choice '${choice}' does not match any of the check boxes`);
        //
        //Check the found element
        found.checked = true;
    }

}
//
//Modelling multiple choice user inputs
export class radios extends choices{
    //
    constructor(proxy:HTMLElement, public option:Partial<option.multiple>){
        super(proxy, option);
        //
        //Add an event listeners to support fluctuation
        this.elements.forEach(element=>{
            element.onchange=()=>radios.onchange(element)
            //
            //Execute fluctuate on this element as soon as it s created
            radios.fluctuate(this.proxy, element);
        });
        
    }
    
    //Return multiple values as a string
    get_value():clean{
        //
        //Selec all teh elements that are  cehcked
        const found:HTMLInputElement|undefined = this.elements.find(element=>element.checked);
        //
        //No checked value implies a null' otherwise return the trimmed value
        //of the found element 
        return found===undefined ? null: found.value.trim();
    }

    //
    //Given the string value, check the matching box 
    set_choices(value:string):void{ this.match(value); }

    //This the the implementation of teh fluctuate utility  implementsd for the
    //radio button scenario. The following arrangement is assumed for the utility
    //to work:-
    /*
    <div id=$dfname  class="MOTHER/DATAFIELD">

        <fieldset>
            <label class="SIBLING"> 
                Some label:<input type="radio" name=$dfname>
            </label>
            other tags
        <fieldset>

        <fieldset>
            <label class="ELDER/REF"> 
                Some label:<input type="radio" name=$dfname checked>
            </label>
            other tags
        <fieldset>
        ...
    </div>
    */
    static onchange (ref:HTMLInputElement){
        //
        //Get the data-field, i.e., the element that envelops the referenced one
        //Elsewhere, it is also known to as the mother 
        const mother: HTMLElement | null = ref.closest("*[id]");
        //
        //If the mother field is not found then this utility cannot be used.
        //continue but alert teh user
        if (!mother) {
            const error = new Error("No data-field closest to the current reference element found");
            console.info(error,ref);
            return;
        }    
        //
        //Now perform the fluctuation, i.e. expanding the child that contains 
        //the ref and collapsing the others. 
        radios.fluctuate(mother, ref);
    }

    //Expand the child (of the given data field) that conatins teh referenced 
    //element and collpase the rest of her children. Here is a HTML fragment that
    //has the deisred arrangement:-
    /*
    <div id=$dfname  class="DATAFIELD">

        <fieldset>
            <label class="SIBLING"> 
                Some label:<input type="radio" name=$dfname>
            </label>
            other tags
        <fieldset>

        <fieldset>
            <label class="SIBLING"> 
                Some label:<input type="radio" name=$dfname checked class="REF">
            </label>
            other tags
        <fieldset>
        ...
    </div>
    */
    public static fluctuate(datafield:HTMLElement, ref:HTMLInputElement):void{
        //
        //Get the css that is used for targeting the children of the datafield
        //that are of interest. It is based on the ref element.
        const css:string = `input[type="radio"][name="${ref.name}"]`;
        //
        //Get all the radio inputs matching the css (including the reference one).
        const radios = <Array<HTMLInputElement>>Array.from(datafield.querySelectorAll(css));
        //
        //Behave as if these radios have received the onchange event, just like 
        //the reference one (though they were not actually clicked on).
        radios.forEach(radio=>checkbox.onchange(radio))
    }
    
}

//Modelling multiple choice user inputs
export class checkboxes extends choices{
    //
    constructor(proxy:HTMLElement, public option:Partial<option.multiple>){
        super(proxy, option);
    }
    
    //Return the dirty value from a check box 
    get_value():clean{
        //
        //Collect all the selected elements
        const selections = this.elements.filter(element=>element.checked);
        //
        //An empty list is equivalent to a null; otherwise return the choices
        //as an encoded string
        return selections.length===0 ? null : JSON.stringify(selections);
    }
    //
    //Given the array of values as a string, check the matching boxes
    set_choices(value:string):void{
        //
        //Let choices be an array of strings
        let choices:Array<string>;
        //
        //Decode the string value and if erroneous, throw the error as mutall version
        try{ choices = JSON.parse(value);}
        catch(error){throw new mutall_error((error as Error).message, value)}
        //
        //The choices must be an array
        if (!Array.isArray(choices)) throw new mutall_error(`{$value} is not an array of string`);
        //
        //Match the choices to their checkboxes
        choices.forEach(choice=>this.match(choice));
    }

}

//A checkbox is used for collecting optional values. Its resulty type
//is best canbe described as 
/*
type result = string|null 

where string is the checkbox.value if checked, and null is the value if
uncheked
*/
export class checkbox extends input{
    //
    constructor(proxy:HTMLElement, public options:Partial<option.input>){
        super(proxy, options);
    }
    
    //If return the checkbox value; otherwise return a null
    get_value():string|null{
        return this.element.checked ? this.element.value : null;
    }

    //If a value is valid, set the checkbox's value and check it. Otherwise
    //Uncheck it 
    set_value(value:string|null|undefined){
        if (value) {
            this.element.value = value;
            this.element.checked=true;
        }
        else this.element.checked=false;
    }

    //This is an event handler for the checkbox (or radio) button referred to
    //as the ref, that was developed y Maggie and Mogaka to handle the fluctuate 
    //nehaviour. When the ref is chaanged, its siblings will be shown. If unchecked, 
    //they will be hidden. This utility assumes the following layout:-
    /*
        <fieldset id="others" class="DATAFIELD">
            <label class="ELDER"> 
                Other:<input class="REF" type="checkbox" onchange="checkbox.onchage(this)">
            </label>
            <label> class="SIBLING">
                Specify <input type="text">
            </label>
        <fieldset>
    */
    static onchange(ref:HTMLInputElement){
        //
        //Get the field element that envelops the reference. Any alement
        //with a class name that matches the value of the ref is considered valid
        const css:string  = `.${ref.value}`; 
        const datafield:HTMLElement|null = ref.closest(css);
        //
        //If no data field is found, then you cannot use this utility
        if (!datafield) return;
        //
        //Get the elder child of the mother data field; its the one containing 
        //the reference element
        const elder:Element =Array.from(datafield.children).find(child=>child.contains(ref))!;
        //
        //Get the siblings of the elder child. They are the children of the mother 
        //data field exluding the reference
        const siblings:Array<Element> = Array.from(datafield.children).filter(child=>child!==elder);
        //
        //The sibblings should be hidden if the refrence is not checked
        const hidden:boolean = ref.checked ? false : true;
        //
        //Show or hide the siblings, depending on the reference's checked status
        siblings.forEach(sibling => {if (sibling instanceof HTMLElement) sibling.hidden = hidden});
    }
}


//Modelling inputs by selecting files from a local client 
export class file extends io{
    //
    //FileList is a key characteristic of this io
    public filelist:FileList;
    //
    //The destination path of a file
    private __destination?:string;
    //
    constructor(proxy:HTMLElement, public option:Partial<option.file>){
        super(proxy, option);
        //
        //A file list must be present; it was the minimum condition for creating
        //this io
        this.filelist = option.element!.files!;
    }


    //
    //The html element that handles teh user interaction
    get element():HTMLInputElement{
        //
        if (this.option.element) return  this.option.element;
        //
        //Place code for alternative ways of determining the input element here
        //
        //Action of the last resort
        throw new mutall_error(`File input element not found`);
    }

    //Retrns the path on the server (where to save the input file) by searching
    //the environment
    get destination():string{
        //
        //Let path be the destination folder on teh server
        let path:string;
        //
        //Let found be the html element that has a destinatiion attribute 
        let found:HTMLElement|null;
        //
        //If the matching local variable is set, the use it is as the destination.
        if (this.__destination) path = this.__destination;
        //
        //If the destination is in the options, then use it 
        else if (this.option.destination) path = this.option.destination;
        //
        //If the destination is define in the ancesstors elements, then use it
        else if(
            (found= this.proxy.closest('*[data-destination]'))
            && found.dataset.destination
        ) path = found.dataset.destination;
        //
        //It is an error if a requested destination cannot be found
        else throw new mutall_error(`Destination path where to save file on the server not found`, this);
        //
        //Set the local destination and return it 
        return (this.__destination = path); 
    }
    //
    //The destination of a file can be set
    set destination(path:string){
        this.__destination = path;
    }

    //The value of a file io is the path on the server where the file is found
    //plus its base name.It is an error if it is not a single file; 
    get_value():clean{
        //
        //If there is one file selected then its value is the destination path 
        //plus its base name
        if (this.filelist.length===1) return `${this.destination}/${this.filelist[0].name}` ;
        //
        //It is an error if there are multiple files selected
        if (this.filelist.length>1) 
            throw new mutall_error(`Unable to determine this file value. There are '${this.filelist.length}' files`);
        //
        //There there is no file selection. if and a url exist, then return it
        if (this.url) return this.url;
        //
        //Ask the user to select a file
        throw new mutall_error(`Please select a file for field '${this.name}' `);
    }

    //The value of a  file is a compound structure, comprising of a url and
    //a base filename
    set_value(value:{url:string, destination:string}):void{
        //
        //Destructure the value
        const {url, destination} = value;
        //
        this.url = url;
        this.destination = destination;
    }

    //Use the server method to a pload a file. Why is undefined a result possibility?
    async upload():Promise<'ok'|Error|undefined>{
        //
        //It is an error to call this method when there are no files to load
        if (this.filelist.length===0)
            throw new mutall_error(`There are no '${this.name}' files to load`);
        //
        //Use the server method to upload files, if necessary
        const result:'ok'|Error = await upload_files(this.filelist, this.destination);
        //
        //return the result
        return result;
    }
}

//
export class read_only extends input{
    //
    constructor(proxy:HTMLElement, public option:Partial<option.input>){
        super(proxy, option);
    }

    //A readonly does not need error reporting by its very nature
    get reporter():HTMLElement{
        throw new mutall_error('No error can be commited on a readonly')
    }
}


//This extension of a file class models an image, to support i/o operations to
//do with image selection from both local client and remote server.
export class image extends file{
    //
    constructor(proxy:HTMLElement, public options:Partial<option.image>){
        super(proxy, options);
        //
        //Attach the event for previewing an image, if necessary
        if (options.preview) this.element.onchange=()=>image.local_preview(this.element); 
    }
    
    //Set the value to an image source
    set_value(value:{url:string, destination:string}):void{
        //
        //An image is a file, so do the (parent) file setting before doing 
        //anything extra
        super.set_value(value);
        //
        //Then handle the extra bit for image pre-reviewing
        //
        //Get the image preview tag. There must be one because this fact is 
        //what we used to promote this from a file to an image io
        const img:HTMLImageElement = this.options.preview!;
        //
        //Set the image source to the url
        img.src = value.url;
    }

    //
    // Preview an image selected from the local client (rather than remote server)
    static async local_preview(input:HTMLInputElement):Promise<void> {
        //
        //Do not continue if there is no selected file 
        if (!(input.files && input.files.length>0)) return;
        //
        //Get the image element which supports the previewing
        const img:HTMLImageElement =  image.get_image(input);
        //
        //Create a utility for reading the contents of the selected file
        const  reader = new FileReader();
        //
        //On reading the file, preview it
        reader.onload = (e:ProgressEvent<FileReader>)=>{ 
            //
            //There must be an event target
            if (!e.target) throw new mutall_error('Image preview failed; there is no event target ')
            //
            //The target must be a string
            if (typeof e.target.result !=='string') throw new mutall_error('Image preview faild; expected a url (string) event target result');
            //
            //Now preview the image
            img.src = e.target.result;

        }    
        //    
        //Read the content of a file as a data url to be used in the preview image
        reader.readAsDataURL(input.files[0]);
    }

    //Get the image tag that is assumed to be in the neighbourhood, i.e., it is
    //a sibling of the given input.
    static get_image(input:HTMLInputElement):HTMLImageElement{
        //
        //Get the parent of the input; there must be one
        const parent:HTMLElement = input.parentElement!;
        //
        //Get the children of the parent as an array of elements
        const children:Array<Element> = Array.from(parent.children);
        //       
        //Find the first image element amongst the children
        const img:Element|undefined = children.find(child=>child instanceof HTMLImageElement);
        //
        //It is an error if the element is not found
        if (!img) throw new mutall_error(`No image tag found in the neigbourhood this input element '${input.name}'`, input);
        //
        //Return the element as an image tag
        return img as HTMLImageElement
    }
}

//Modelling the io for editing anchor tags
export class url extends io{
    //
    //The anchor tag for previewing edits
    public a:HTMLAnchorElement;
    //
    //The input element for editing the archor elememt's href text
    public href:HTMLInputElement;
    //
    //The input element for editing yeh achor element's text contemt
    public textContent:HTMLInputElement;
    //
    constructor(proxy:HTMLElement, public options:Partial<option.url>){
        super(proxy, options);
        //
        //Get the anchor tag from the options; if not available, create one under the
        //this proxy
        this.a = options.a ?? this.create_element('a', this.proxy);
        //
        //If the href input is available from the options, use it; otherwise create one
        this.href = options.href ?? this.create_element('input', this.proxy, {type:'url'});
        //
        //If the text content is available from the options, use it; otherwise
        //create it.  
        this.textContent = options.textContent ?? this.create_element('input', this.proxy, {type:'text'});
        //
        //Synchronise changes in the anchor parts (href and text content) with 
        //the anchor itself
        this.href.onchange = ()=>this.a.href=this.href.value;
        this.textContent.onchange = ()=>this.a.textContent=this.textContent.value;
    }
    
    //The value of an anhor tag is a compuntd one
    get_value():{href:string, textContent:string}|Error{
        //
        //Get the anchor source
        const href:string = this.href.value;
        //
        const textContent:string = this.textContent.value;
        //
        //It is an error if any of the componnets is null
        if (href==='') return new Error('Anchor href is empty');
        if (textContent==='') return new Error('Anchor text is empty');
        //
        return {href, textContent};
    }

    //Set the value of a url
    set_value(value:{href:string, textContent:string}){
        //
        this.href.value=value.href;
        //
        this.textContent.value = value.textContent;
        //
        //Synchronise the anchor element with the input value
        this.a.href = value.href;
        this.a.textContent = value.textContent;
    }


    //This function updates the anchor tag as you type in either the text or 
    //url input fields, a.k.a., ref. The following user arrangement is assumed
    /*
        <fieldset id="business_url">
            <legend>Business Name and Website Link</legend>
            <label>
                Name: <input type="url" name="business_url" maxlength="255" size="10" oninput="a.oninput()">
            </label>
            <label>
                URL: <input type="text" name="business_url" oninput="a.oninput()">
            </label>            
            <a href="">Click me</a>
        </fieldset>

    */
    static oninput(ref:HTMLInputElement) {
        //
        //Get the data field element. It has the field's id
        const datafield:HTMLElement|null = ref.closest('*[id]');
        //
        //The data field must exist
        if (!datafield) throw new mutall_error('Data field not found for this input element', ref)
        //
        //Get the only input element that holds the text content
        const url = <HTMLInputElement>io.get_unique(datafield, 'input[type="url"]'); 
        //
        //Get the only input element that holds the url
        const name = <HTMLInputElement>io.get_unique(datafield, 'input[type="text"]');
        //
        //Get the only anchor element 
        const anchor = <HTMLAnchorElement>io.get_unique(datafield, 'a');
        //
        //Match the text content of our anchor tag to the business name
        anchor.textContent = name.value || "Click me";
        //
        //Match the href property of the anchor tag to the url
        anchor.href = url.value || '';
    }
        
}

//A discriminant is the io associate with a discriimnant key. This is the io
//assigned to a key which cannot be located on a form, and whose type matches
//the word 'type'. In this regard mutadd_data discourages use of 'type' as a field
//to mean anything else other than a discriminant. It is also a reserbved word
//in typescript
export class discriminant extends io{

    //A discriminant has no options and has no html representation
    constructor(){
        //
        //The proxy associated with the roor elememt is the document's body
        super(document.body);
    }
    //
    //The value of a discrimiknant is not important. Set it to null
    get_value(){return null}
    //
    //A discriminant cannot be set. So, ignore any request to do so 
    set_value(i:any){}

} 
