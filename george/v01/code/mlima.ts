//Access the page library from the view file in the outlook folder
import {page} from "../../../outlook/v/code/view.js";
//
//To help us execute PHP methods on thes server
import * as server from "../../../schema/v/code/server.js";
//
//To help in the copying of the Katiba in the content section
import {template} from "../../../outlook/v/code/outlook.js";

//To help in using the view class as a type for the contents of the destination
//array
import {view} from "../../../outlook/v/code/view.js";
//
//Define the member type
type member = {
    title:string, 
    name:string, 
    photo:string, 
    registration_id:string
};

//This is teh home pof all the methods developed to support the mlima web page
export class mlima extends page {
    //
    constructor(){
        super();
    }
    
    //Get the details of members and show them (including images) on the 
    //content page
    async show_members(){
        //
        //1. Get the members details using a query
        
       
        //
        //1.1 Get the query
        const query:string = `
            select 
                title, 
                name, 
                photo, 
                registration_id  
            FROM member
        `;
        
        //
        //1.2 Execute the query on the mlima database to get the details (using
        //the server library)
        const members:Array<member> = await server.exec(
            'database',
            ['mutall_mlima'],
            'get_sql_data',
            [query]
        )
        
        //
        //Get the content element (using its id)
        const content:HTMLElement= this.get_element('content');
        //
        //Clear the content
        content.innerHTML='';
        //
        // add div with class of members
       const cont:HTMLDivElement= this.create_element('div',content, {className: 'members'});
        //
        //Show the details of each member in the content page
        members.forEach(member=>this.show_member(member, cont));
    }
    
    /*
    Show a member following this HTML code snippet
    
    <div class="pic">
        <img src="$photo" />
        <p>
            <span>$title:</span>
            <span>$name</span>
        </p>
        <p>Registration No: $registration_no</p> 
    </div>
    */
    show_member(member:member, content:HTMLElement):void{
        //
        //Destructure the member to show details
        const {title, name, photo, registration_id} = member;
        //
        //Create the div.pic tag and attachit to the content
        const div: HTMLDivElement = this.create_element('div', content, {className:'pic'});
        //
        //find uot if the photo is null or empty and assign a default image
       if(photo===null || photo==='')
        this.create_element('img',div,{src:'../../images/members/defaultImage.jpeg'})
        //
        // if not Create the image tag with the photo source and link to div.pc
       else {
        this.create_element('img', div, {src:photo, alt:''});}
        //
        //Create the title p tag and attach it to the div.pic
        const p:HTMLElement = this.create_element('p', div);
        //
        //Create a span tag and link it to the title
        this.create_element('span', p, {textContent:title});
        //
        //Create teh member name span tag under the p tag
        this.create_element('span', p, {textContent:name,id:'space'});
        //
        //Create the registartion p tag and link to the div
        if (!(registration_id===null || registration_id===''))
            this.create_element('p', div, {textContent:`Registration No: ${registration_id}`});
        
    }  
    
    //Responsible for toggling back to the constitution
    async copy(source_id:string, dest_id:string, file:string):Promise<void>{
      //
      //Create an instance of the template class, to support carnibalization
      const Template = new template(file);
      //
      //Compile the destination; its the content element in this page
      const dest:[view, string]=[this, dest_id];
      //
      //Wait for template to read the html content
      await Template.open();
      //
      //Transfer them to the destination
      Template.copy(source_id, dest);
      //
      //Close the template window
      Template.close();
      
    }
      
    //Responsible for toggling back to the constitution
    async show_katiba():Promise<void>{
        this.copy('source', 'content', 'template.html');
    }
    
    //Show the panels in the home page
    public async show_panels(): Promise<void> {
        //
        await this.show_katiba();
        //
        await this.show_messages('message');
        //
        await this.show_events('event');
    }
    
    //Whar it does
    //anchor?
    //Strategy=Template.copy
    //copy(src: string, dest: [view, string]): HTMLElement
    public async show_messages(anchor:string):Promise<void>{
        //uses the copy method with id messages im messages html
        // being the soure and anchoring it
       await this.copy('messages',anchor,'messages.html') 
    } 
    //method for displaying the events of the group 
    public async show_events(anchor:string):Promise<void>{
    //will use the copy method to copy the content in event.html
    //with the id eventsand anchoring it
    await this.copy('event',anchor,'event.html') 
    }
}


