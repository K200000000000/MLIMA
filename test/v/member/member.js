//
import { iota } from "./iota.js";
//
//-exec: a function for executing class-based PHP code on the server
import { exec } from "../../../schema/v/code/server.js";
//
//-io class supports mutall-data's input/output operation of a form 
import { file } from "./io.js";
//The mlima member is modelled as an iota -- a page comprising of ios --
export class member extends iota {
    input;
    //
    //Constructing a member requires:-
    constructor(
    //
    //The data to populate the dialog box in the form of a script that is
    //fit for programing
    input) {
        // 
        //Initialize the parent dialog
        super("./member.html");
        this.input = input;
    }
    //Return as many kes as there are in the input structi+ure
    get_keys() {
        //
        return Object.keys(this.input);
    }
    //Get the input value that matches index k and mold it to dirt
    match_value(k) {
        return this.input[k];
    }
    //Save both content and metadata. For this version, ignore the data and 
    //instead use the ios to drive the process. The justification for this is
    //that the source of the data is the ios. So, we are using the richer source
    async execute(data) {
        //
        //Seperate data into content (formData) and metadata (questionnaire labels)
        const { content, metadata } = this.separate_content();
        //
        //Use the server library to upload content 
        const content_errors = await this.upload_content(content);
        //
        //Use questionnnaire to load the the metadadata 
        const metadata_errors = await this.save_metadata(metadata);
        //
        //Combine the errors
        const errors = [...content_errors, ...metadata_errors];
        //
        //Return the errors
        return errors;
    }
    //Separate the current ios into content (files) and metadata (layouts)
    separate_content() {
        //
        //Get all the ios of encountered in used for capturing yhe data
        const ios = Object.values(this.ios);
        //
        //Select all those file ios that have ben used to select files
        const content = ios.filter(io => io instanceof file && io.filelist.length > 0);
        //
        //Collect all labels valid from all the layouts
        const metadata = [];
        for (const io of ios)
            metadata.push(...io.collect_label());
        //
        return { content, metadata };
    }
    //Upload the given file contents, reporting any errors that are encountered
    async upload_content(files) {
        //
        //Start with an empty report
        const errors = [];
        //
        //Upload every file
        for (const file of files) {
            //
            //N.B. The result of nothing to upload is unedefined 
            const result = await file.upload();
            //
            //If the uploading was erroneous, collect the error
            if (result instanceof Error)
                errors.push(result);
        }
        //
        //return the list of  errors encountered during uploading
        return errors;
    }
    //Save the metadata to the mlima database. N.B. The is no such a type as
    //AsyncGenerator as suggested by ChatGPT, so this definition is not
    //valid: AsyncGenerator<Error>. I left it out
    async save_metadata(layouts) {
        //
        //Run the utility for exceutong PHP code from Javascript. The return value
        //is that of the method being executed
        const results = await exec(
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
        [layouts] //method arguments
        );
        //
        //Return a list of errors. If pk, none; otherwise the error as a list
        return results !== 'ok' ? [] : [new Error(results)];
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
    report_targeted_error(id, error) {
        //
        //Get the io that matches the id
        const io = this.ios[id];
        //
        //Let the io report the error
        io.show_error(error);
        //
        return undefined;
    }
}
