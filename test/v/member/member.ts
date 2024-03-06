import {key, dirt, discriminant} from "./quiz.js";
//
import {iota} from "./iota.js";
//
//-exec: a function for executing class-based PHP code on the server
import { exec} from "../../../schema/v/code/server.js";
//
//Access data types for supportin savin of data to a database
//-a label is a data layout comprising of the simplest data that can be
//written to a database. 'table' is a more complex type comprising of data 
//laid out in the commom tabular fashion 
import {label} from "../../../schema/v/code/questionnaire.js";
//
//-io class supports mutall-data's input/output operation of a form 
import {io, input, file, image, read_only, url} from "./io.js";
//
//The data to be managed using the member class that follows matches its
//definition in the database where it is retrived and saved. This interface
//represents the database output after json parsing it, so that the resulting
//script is fit for programming 
//Is this an a example of the Object Relation Modelling (ORM) concept?. 
export interface Imember extends discriminant{
    //
    //The primary key is required but cannot be edited. If it is avialable, it  
    //will be made inaccessible for editing. New members do not have a key, so 
    //this is optional
    member:number;
    //
    //The photo is a url to the image iteslf
    photo: {url:string, destination:string};
    //
    name: string;
    email: string;
    //
    //All the fields below are optional
    
    phone?: string;
    title?: string;
    gender?: string;
    registration_id?: string;
    national_id?: string;
    occupation?: string;
    business_url?: {name:string, url:string};
    comment?: string;
}

//My local version of ios
type myios =  {
    //
    type:read_only,
    member:read_only,
    photo: image,
    name: input,
    email: input,
    phone: input,
    title: input,
    gender: input,
    registration_id: input,
    national_id: input,
    occupation: input,
    business_url: url,
    comment: input
}

//This data type is used for tranporting data (collected using a form) from a 
//local client to a remote serve
type transport = {content:Array<file>, metadata:Array<label>};
    
//The mlima member is modelled as an iota -- a page comprising of ios --
export class member extends iota<Imember>{
    //
    //Localize the io
    declare ios:myios;
    //
    //Constructing a member requires:-
    constructor(
        //
        //The data to populate the dialog box in the form of a script that is
        //fit for programing
        public input:Imember
    ){
       // 
       //Initialize the parent dialog
        super("./member.html");
    }


    //Return as many kes as there are in the input structi+ure
    get_keys():Array<key<Imember>>{
        //
        return Object.keys(this.input) as Array<key<Imember>>; 
    }
    
    //Get the input value that matches index k and mold it to dirt
    match_value(k:key<Imember>):dirt{
        return  this.input[k];
    }    

    
   
    
    //Save both content and metadata. For this version, ignore the data and 
    //instead use the ios to drive the process. The justification for this is
    //that the source of the data is the ios. So, we are using the richer source
    public async execute(data: Imember): Promise <Array<Error>> {
        //
        //Seperate data into content (formData) and metadata (questionnaire labels)
        const {content, metadata} = this.separate_content() 
        //
        //Use the server library to upload content 
        const content_errors:Array<Error> =  await this.upload_content(content);
        //
        //Use questionnnaire to load the the metadadata 
        const metadata_errors:Array<Error> = await this.save_metadata(metadata);
        //
        //Combine the errors
        const errors:Array<Error> = [...content_errors, ...metadata_errors];
        //
        //Return the errors
        return errors;
    }    
    
    //Separate the current ios into content (files) and metadata (layouts)
    separate_content():transport{
        //
        //Get all the ios of encountered in used for capturing yhe data
        const ios:Array<io> = Object.values(this.ios); 
        //
        //Select all those file ios that have ben used to select files
        const content = ios.filter(io=>io instanceof file && io.filelist.length>0) as Array<file>;
        //
        //Collect all labels valid from all the layouts
        const metadata:Array<label> =[];
        for(const io of ios) metadata.push(...io.collect_label()); 
        //
        return {content, metadata};
    }
    
    //Upload the given file contents, reporting any errors that are encountered
    async upload_content(files:Array<file>):Promise<Array<Error>>{
        //
        //Start with an empty report
        const errors:Array<Error> =[];
        //
        //Upload every file
        for(const file of files){
            //
            //N.B. The result of nothing to upload is unedefined 
            const result:'ok'|Error|undefined = await file.upload();
            //
            //If the uploading was erroneous, collect the error
            if (result instanceof Error) errors.push(result);
        }
        //
        //return the list of  errors encountered during uploading
        return errors;
    }

    
    //Save the metadata to the mlima database. N.B. The is no such a type as
    //AsyncGenerator as suggested by ChatGPT, so this definition is not
    //valid: AsyncGenerator<Error>. I left it out
    public async save_metadata(layouts:Array<label>):Promise<Array<Error>> {
        //
        //Run the utility for exceutong PHP code from Javascript. The return value
        //is that of the method being executed
        const results:'ok'|string = await exec(
            //
            //This is a class defined in PHP to support writing of data
            "questionnaire",
            //
            //The construction of a questionaire requires a database to write to 
            ['mutall_mlima'],
            //
            //Use the most common method for load the database; its return type
            //simple: 'ok' or some error message
            "load_common",
            //
            //Layouts specify what data to store and and where to it in the 
            //designated
            [layouts]//method arguments
        );
        //
        //Return a list of errors. If pk, none; otherwise the error as a list
        return results!=='ok' ? []: [new Error(results)];
    }
    
    //
    //Report the given message targeting a specific input that matches the given
    //id.The return value of this method is undefined. This allows us to implement
    //a situation when we need to report and return immediately
    /*
    
    if (x) return report_error(....)
    
    instead of
    
    if (x) {report_error(...); return}
    
    */
    //
    public report_targeted_error(id:key<Imember>, error:Error):undefined{
        //
        //Get the io that matches the id
        const io:io = this.ios[id];
        //
        //Let the io report the error
        io.show_error(error);
        //
        return undefined;
    }

}

