//This file is dedicated to development of the iota class -- an extension
//of the quiz to exploit the use of io in data input and output operations
import {mutall_error } from "../../../schema/v/code/schema.js";
import {input, file, image, url, checkbox, checkboxes, radios, discriminant} from "./io.js"

//The io idea underpins a data i/o system that recognizes Error as an integral 
//part of computer/human interactions
import {io} from "./io.js";

//The quiz library was developed in the mashamba project to support web pages
//designed for data collection (as opposed to content serving only)
import {key, quiz, dirty, dirt} from "./quiz.js"

//The structure for manging ios is indexd by the keys of u 
export type ios<i> = {[k in key<i>]:io};

//The main function of thos class is to create ios from information in teh HTML
export abstract class iota<i> extends quiz<i> {
    //
    //The following 2 properties support the public ios and keys 
    //properties
    //
    //a). The indexed array for tracking the ios of this dialog in terms of the 
    //inputs keys. The ios are initialized in the populate method
    public  ios?:ios<i>;
    //
    //b). The list for tracking the keys associated with the input data, i
    public keys?:Array<key<i>>;
    
    constructor(url?:string){ super(url)}
    //
    //Returns the keys of i, the data being processed.  N.B. We don't assume 
    //that the iota needs to have an input, so we just cannot deduce the keys 
    //from the inout; the login scenario is a case in point. When the keys can 
    //be deduuced from teh inout -- that is a special case.
    abstract get_keys():Array<key<i>>;
    //
    //Get the (value some variable) that matches the given key from the input to
    // this iota page. Typically this is a tep is just after querying a database. 
    //The term get_value(x) means something different. It means reading a value
    // from the input form to some variable -- teh step just before saving the
    //value to a database. Match value must be provided by users since they 
    //understand where the input is coming from
    abstract match_value(key:key<i>):dirt;

    //Create an io, given the current HTML page, assuming that the given key 
    //references a named element. This is the so called The Name Stategy.
    public create_io(key:key<i>):io{
        //
        //Formulate the search css for identifying the elements named by the 
        //given key
        const css:string = `*[name="${key}"]`;
        //
        //Collect all the named elements; the result comprises of such elements 
        //as input, textarea, button, select, etc.
        const elements = <Array<HTMLElement>> Array.from(this.proxy.querySelectorAll(css));
        //
        //The type of io, simple or complexs, depends on the number of the elements
        //under one name
        const len:number = elements.length;
        //
        //If no named element is found then verify if the name is 'type'; its 
        //what mutall_data uses as a discriminant
        if (len===0 && key==='type') return new discriminant();
        //
        //If teh key is not a discriminant then we assume that the user fogit to 
        //include it in the form during design.Let the user know, so that the 
        //code logic may be modified to avoid getting here.
        if (len===0) throw new mutall_error(`Unable to create an io using key '${key}'`);
        //
        //If only one element is involved, then create and return a simple io, 
        //e.g., input, textarea, select, button, etc.
        if (len===1) return this.create_simple_io(key, elements[0]);
        //
        //A complex element is characyerised by more than 1 named element.
        //Create it
        return this.create_complex_io(key, elements);
    };


    //Create a simple io, e.g., input, textarea, select, button, etc
    private create_simple_io(name:key<i>, element:HTMLElement):io{
        //
        //Get the data field that contains this element. There  must be one
        const datafield:HTMLElement|null = element.closest('*[id]');
        //
        //If no field such field exist, then assume the element is the proxy
        //of teh io, otherwise it is the data field
        const proxy:HTMLElement = datafield ?? element;
        //
        //A file io is a special input case
        if (element instanceof HTMLInputElement){
            //
            //Get the input element type
            const type:string = element.type;
            //
            //Specialise a file to an image if necessary
            if (type==='file') return  this.get_file_io(name, element, proxy);
            //
            //The value of a heckbox requires spceial interpretation. Or does
            //teh JS system interprets it correctly?
            if (type==='checkbox') return  new checkbox(proxy, {name, element});
        }
        //
        //If an element does not require special treatment, then treat it like
        //an input
        return new input(proxy, {name, element:<HTMLInputElement>element});
    }

    //Returns a file io. If there is sufficient evidence, return an image io
    private get_file_io(key:string, element:HTMLInputElement, datafield:HTMLElement):file{
        //
        //Test for an image tag in the vicinity (used for previewing) as the
        //evidence we require
        //
        //Get the parent of the element; there must be one
        const parent = element.parentNode!;
        //
        //Find a child of the parent that is an image
        const img = Array.from(parent.children).find(child=>child instanceof HTMLImageElement) as HTMLImageElement;
        //
        //If there is an image element nearby, then return an image io
        if (img) return new image(datafield, {name:key, element, preview:img});
        //
        //Otherwise return a file io
        return new file(datafield, {name:key, element});
    }

    //A complex io is one which is made of more than 1 named element, e.g., 
    //multiple choices
    private create_complex_io(name:key<i>, elements:Array<HTMLElement>):io{
        //
        //Get the data field that envelops the given elements
        const proxy:HTMLElement = this.get_data_field(elements);
        //
        //Define an free Io; it can be voif
        let Io:io|void;
        //
        //Return a radios is if it is valid to do so
        if ((Io=this.create_choices_io('radio', proxy, name, elements))) return Io;
        //
        //Return a checkboxes is if it is valid to do so
        if ((Io=this.create_choices_io('checkbox', proxy, name, elements))) return Io;
        //
        //Return a url io is if it is valid to do so
        if ((Io=this.create_url_io(name, proxy, elements))) return Io;
        //
        //This is an opportunity for the user to create own io
        return this.create_udf_io(name, proxy, elements); 
        
    }

    //Creates a user defined io. This method is public, so that users can 
    //override to implement their own io types
    public create_udf_io(name:key<i>, proxy:HTMLElement, elements:Array<HTMLElement>):io{
        throw new mutall_error(`This key '${name}' matches a complex io. You need to define it`);
    };

    //Create an io fit for inputing urls
    private create_url_io(name:key<i>, proxy:HTMLElement, elements:Array<HTMLElement>):url|undefined{
        //
        //The given elements must include a text input element of type url
        const href = <HTMLInputElement|undefined>elements.find(element=>
            element instanceof HTMLInputElement 
            && element.type==='url'
        )
        //    
        //This cannot be a url; discontinue teh search
        if (!href) return undefined;
        //
        //The elements must also include an input for capturing the text content
        const textContent = <HTMLInputElement|undefined>elements.find(element=>
            element instanceof HTMLInputElement 
            && element.type==='text'
        )    
        //
        //A url must prvide a place for captuerung the texy content of an anchor 
        //tag. So, this cannot be a url. Discontinue the search
        if (!textContent) return undefined;
        //
        //There must be an one and only one anchor element in the visinity
        const a = <HTMLAnchorElement>io.get_unique(proxy, 'a');
        //
        return new url(proxy, {name, a, href, textContent});
    
    }
    
    //
    //Return the requested choices if it is valid to do so
    private create_choices_io(
        type:'radio'|'checkbox',
        proxy:HTMLElement, 
        name:key<i>,  
        elements:Array<HTMLElement>
    ):checkboxes|radios|void{
        //
        //All the input elements must be input elements
        const inputs = <Array<HTMLInputElement>>elements.filter(elem=>elem instanceof HTMLInputElement);
        if (inputs.length!==elements.length) return console.info(`This is list is not inputs only`, elements); 
        //
        //Filter all the elements that match the given type
        const matches:Array<HTMLInputElement> = inputs.filter(element=>element.type===type);
        //
        //Types cannot be mixed
        if (matches.length!==inputs.length) 
            return console.info(`${matches.length} matches found where ${inputs.length} matches were expected`);
        //
        //Create an io, depending on the input type...
        switch(type){
            //
            //Single choice io type is referred to as radio
            case 'radio': return new radios(proxy, {name, elements:inputs});
            //
            //The type for multiple value choices is called checkboxes. N.B. in
            //prural
            case 'checkbox': return new checkboxes(proxy, {name, elements:inputs});
        }
    }    


    //Returns the data field that envelops the given elements
    private get_data_field(elements:Array<HTMLElement>):HTMLElement{
        //
        //Map all the elements to their closet data fields
        const data_fields:Array<HTMLElement|null> = elements.map(element=>element.closest('*[id]'));
        //
        //It is an error if some of the elements do not have an associated data field
        let no_df:Array<HTMLElement>;
        if ((no_df=<Array<HTMLElement>>elements.filter((element,i)=>data_fields[i]===null)).length>0) 
        throw new mutall_error(`These elements do not have a data field`, no_df);
        //
        //Collect the unique (HTMLElement) data fields and convert them to an array
        const uniques = <Array<HTMLElement>>[...new Set(data_fields)]; 
        //
        //It is an error if the elements do not share a common data field
        if (uniques.length===0)
            throw new mutall_error(`These multiple choice elements do not share a data field`, uniques);
        //
        //It is an error if the input elements have more than 1 data fields
        if (uniques.length>1) 
            throw new mutall_error(`These multiple choice elements have ${uniques.length} different data fields`, elements, uniques);
        //
        //Get the only data field. There is one; we just ensured so, above
        const datafield:HTMLElement = [...uniques][0]!;
        //
        //Return the data field
        return datafield;
    }


    //Populate the current form with data using the io approach. This method is 
    //designed to highlight the (abstract) methods that an io class must 
    //implement
    public populate(): void {
        //
        //Get the (string versions of the) keys of this iota
        const keys:Array<key<i>> = this.get_keys();
        //
        //Save the keys for further references
        this.keys = keys;
        //
        //Prepare to collect ios
        const ios:Partial<{[key in keyof i]:io}>={};
        //
        //Use the keys to populate this iota page
        keys.forEach(key =>{
            //
            //Create an io that matches the given key index; this is a process 
            //designed to match the type of data indexed by the key and the HTML 
            //code of the current page 
            const io = this.create_io(key);
            //
            //Save the io, to be re-used during the data reading phase
            ios[key] = io;
            //
            //Get the value that matches the given key from the input to this 
            //iota page. The term get_value(x) is already used and means something 
            //different. It means reading a value from the input form. Match 
            //is a similar term which means the value must be provided by the 
            //user via abstraction. N.B. We don't assume that the iota
            //needs to have an input; the login scenario is a case in point
            const value:dirt =this.match_value(key); 
            //
            //Set the value
            io.value = value;
            
        }); 
        //
        //Now save the ios
        this.ios = <ios<i>>ios;
    }

    //
    //Read is the opposite of populate; it and returns the dirty version of
    //of the desired date, i. The check operaton implemented in the quiz class
    //handles the error reporting before handing the cleaned version over to 
    //the execution process
    public read(): dirty<i> {
        //
        //The ios must be defined by now
        if (!this.ios) throw new mutall_error('The ios for this page are not yet set')
        //
        //Start with an empty dirty member
        //const result:Partial<dirty<i>> = {};//Not sure why this is erroneous
        const result:Partial<i> = {};
        
        //
        //Loop through all the keys of this member and read the ios
        this.keys!.forEach(key=>{
            //
            //Get the k'th io
            const io = this.ios![key];
            //
            //Use the ios's value to set the result
            result[key] = io.value;

        });
        //
        //Return the result
        return result as dirty<i>;
    }

    
  
}