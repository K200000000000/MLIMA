//Access the page library from the view file in the outlook folder
import { page } from "../../../outlook/v/code/view.js";
//
//To help us execute PHP methods on thes server
import * as server from "../../../schema/v/code/server.js";
//
//To help in the copying of the Katiba in the content section
import { template } from "../../../outlook/v/code/outlook.js";
//
//To help in using the template class used for login 
import { registration } from "../../../registration/v/code/registration.js";
import { mutall_error } from "../../../schema/v/code/schema.js";
//
//TODO's
//1. Too much flashing on the screen. use the fetch method instead.KM
//2. Login system. JM.
//3. Make the paragraph readable by reducing the contents of the paragraph to just one liner.
//This is the home of all the methods developed to support the mlima web page
export class mlima extends page {
    register;
    //The user that is currently logged in
    user;
    //
    //The members element
    members_element;
    //
    constructor() {
        super();
        this.register = new registration();
    }
    MessageHandler() {
        const sendButton = document.querySelector('button[onclick="page.send_message()"]');
        const message_text_area = document.getElementById('message_text_area');
        if (sendButton && message_text_area) {
            sendButton.addEventListener('click', () => {
                // Assuming there is a function to send the message
                // Clear the text area after sending the message
                message_text_area.value = '';
            });
        }
    }
    //Get the details of members and show them (including images) on the 
    //content page
    async show_members() {
        //
        //1. Get the members details using a query
        //
        //1.1 Get the query
        const query = `
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
        const members = await server.exec('database', ['mutall_mlima'], 'get_sql_data', [query]);
        //
        //Get the content element (using its id)
        const content = this.get_element('content');
        //
        //Clear the content
        content.innerHTML = '';
        //
        // Add div with class of members
        this.members_element = this.create_element('div', content, { className: 'members' });
        //
        //Show the details of each member in the content page
        members.forEach(member => this.show_member(member, this.members_element));
    }
    //
    show_member(data, content) {
        //
        //Destructure the member to show details
        const { title, name, photo, registration_id } = data;
        //
        //Create the div.pic tag and attachit to the content
        const div = this.create_element('div', content, { className: 'pic' });
        //
        //Add an event listener to the div, so that on click, the animation 
        //stops the piture is put in edit mode.
        div.onclick = () => this.edit_member(data, div);
        //
        //Find out if the photo is null or empty and assign a default image
        if (photo === null || photo === '')
            this.create_element('img', div, { src: '../../images/members/defaultImage.jpeg' });
        //
        // if not Create the image tag with the photo source and link to div.pc
        else
            this.create_element('img', div, { src: photo, alt: '' });
        //
        //Create the title p tag and attach it to the div.pic
        const p = this.create_element('p', div);
        //
        //Create a span tag and link it to the title
        this.create_element('span', p, { textContent: title });
        //
        //Create teh member name span tag under the p tag
        this.create_element('span', p, { textContent: name, id: 'space' });
        //
        //Create the registartion p tag and link to the div
        if (!(registration_id === null || registration_id === ''))
            this.create_element('p', div, { textContent: `Registration No: ${registration_id}` });
    }
    //
    //Stop the animation in the content panel and put the picture in edit mode
    //If successful editing, save the changes to the datanase and re-animate. If
    //the editing is canceleded, revert back to view mode, and continue the animation
    async edit_member(data, anchor) {
        //
        //1.Stop the vertical flow(animation)
        this.members_element.classList.add('animation_pause');
        //
        //2.Open the picture and the member details in edit mode
        //it should allow editting of the name, phone no,reg no,picture and email 
        //the edit mode should include a save button and discard button.JM/MW.
        const dialog = await this.open_picture(data, anchor);
        //
        //wait for the user to save successfully or cancel the process
        const result = await new Promise(resolve => {
            //
            //4. If save is requested save the member "completely" and stop the edit
            //if successful.GK.
            let save = dialog.querySelector(".save");
            if (!save)
                throw new mutall_error("Your save button is missing");
            save.onclick = async () => {
                //
                //3. Collect yhe member details to save.(JM)
                const details = await this.get_details(dialog);
                //
                //Save the memner
                const result = await this.save_member(details);
                //
                //test teh save result
                if (result instanceof Error)
                    this.report_error('report', result.message);
                else
                    resolve(result);
            };
            //   
            //5. If edit is canceled then abort this edit as canceld.PK/PM
            let cancel = dialog.querySelector(".cancel");
            if (!cancel)
                throw new mutall_error("Your cancel button is missing");
            cancel.onclick = () => resolve('canceled');
        });
        //
        //6. Close the dialog box by detaching it from the member form.PK/PM
        anchor.removeChild(dialog);
        //
        //7. If the edit was succesful, reflect the chages in the content panel.JK
        if (result !== 'canceled')
            this.update_content_panels(result);
        //
        //8. Re-animate the content panel.
        this.members_element.classList.remove('animation_pause');
    }
    //Save the given member to the databse, using layouts and questionnaire(JK)
    async save_member(data) {
        //
        //Collect layouts from details
        //
        //Create a new questionnaire for saving to the mlima database
        //
        //Use the most common method of loading data
        //
        //if 'Ok' return the member's details; otherwise return an error with 
        //appropriate message
    }
    //Responsible for toggling back to the constitution
    async copy(source_id, dest_id, file) {
        //
        //Create an instance of the template class, to support carnibalization
        const Template = new template(file);
        //
        //Compile the destination; its the content element in this page
        const dest = [this, dest_id];
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
    async show_katiba() {
        this.copy('source', 'content', 'template.html');
    }
    //Show the panels in the home page
    async show_panels() {
        //
        await this.show_katiba();
        //
        await this.show_messages('messages');
        //
        await this.show_events('event');
        //
        await this.show_objectives('services');
        // get the welcome div by id
        const welcome = this.get_element("welcome");
        //
        const current_user = this.register.get_current_user();
        //
        // if the is a 
        if (current_user) {
            //
            this.welcome(current_user);
            //
            //
            this.get_element("login").hidden;
            //
            return;
        }
    }
    //Whar it does
    //anchor?
    //Strategy=Template.copy
    //copy(src: string, dest: [view, string]): HTMLElement
    async show_messages(anchor) {
        //uses the copy method with id messages im messages html
        // being the soure and anchoring it
        await this.copy('messages', anchor, 'messages.html');
    }
    //method for displaying the events of the group 
    async show_events(anchor) {
        //will use the copy method to copy the content in event.html
        //with the id eventsand anchoring it
        await this.copy('event', anchor, 'event.html');
    }
    async show_objectives(anchor) {
        //will use the copy method to copy the content in event.html
        //with the side and anchoring it
        await this.copy('services', anchor, 'katiba.html');
    }
    //Use the questinnaire library to save the message
    async save_message(text) {
        //
        //Collect the layouts needd for savimng the given text message to 
        //the mutall users database
        //Layout (label, table), Array, Generator, Ellipse(...), 
        const layouts = [...this.collect_layouts(text)];
        //
        //Execute the load_common method of a questionaire to transfer 
        //to the a database.
        //PHP classes, library.dt.s file, server, 
        const result = await server.exec(
        //
        //Name of the class that has the load_common method
        'questionnaire', 
        //
        //The name of the datanade where to save the data
        ['mutall_users'], 
        //
        //The name the method to execute
        'load_common', 
        //
        //The argument of the load common is the layouts
        [layouts]);
        //
        //Test if saving was successful or not. If not successful abort this 
        //method with an error message
        //if, !==, throw, mutall_error
        if (result !== 'ok')
            throw new mutall_error(result);
    }
    //Collect the layouts needed for saving the tet message inro the mutall_users
    //database
    //Generic functions
    *collect_layouts(text) {
        //
        //A. Collect the immediately available data, i.e., text message. 
        //N.B. The structire of a label
        yield [text, 'msg', 'text'];
        //
        //B. Collect the mandatory data (partcutilar for new record)
        //-Ignore prmary key
        //member
        yield* this.collect_layouts_of_member();
        //
        //C. Ensure that all identifiers are available. Collect any identifiers
        //that are not inA or B
        //date, Kagara (static method)
        yield [this.standardise_date(new Date()), 'msg', 'date'];
    }
    //Collect layous of a member
    *collect_layouts_of_member() {
        //
        //
        //List all fields used for identification (assuming an old member)
        //User, business
        //
        //Collect identifiers for a user. They are:-name
        yield [this.user.name, 'user', 'name'];
        //
        //Collect idenifier for a buisness. They are:-id
        yield [this.user.business.id, 'business', 'id'];
        //
        //Force a member to be loaded
        yield [null, 'member', 'member'];
    }
    async sign() {
        //
        //
        //1. Get the user that has logged in/registered
        const User = await this.register.administer();
        //
        //If the registration was aborted, do not continue with sign procedure
        if (User === undefined)
            return;
        //
        //Show the message box
        const messageTextArea = document.getElementById("message_text_area");
        messageTextArea.disabled = false;
        //2.Welcome the user
        //2.3 Save the cuurrent user
        this.user = User;
        //
        //Set the user's business
        this.user.business = {
            name: 'Friends of Ngong Hill Conservancy.Please remember to sign out when you are done',
            id: 'wanamlima'
        };
        //welcome user
        this.welcome(User);
    }
    welcome(User) {
        // 2.1 Get the welcome div element
        const welcomeDiv = document.getElementById('welcome');
        //
        // 2.2 Check if the welcome div element exists
        if (welcomeDiv) {
            // Set the welcome message in the div
            welcomeDiv.textContent = `Welcome ${this.user?.name} to ${this.user?.business?.name}`;
            //3. Prepare to sign out
            this.createLogoutButton();
            this.login_user();
        }
        //
    }
    //Sending ammessage does 3 this:-
    //-display the message in the message output area. 
    //  --Assignment for week 1month
    //  --Display user current user still pending
    //  --Include picture of the sender
    //-saves the message to a datanase. 4 weeks
    //  -- Investigated using 1st principles (4 weeks)
    //  -- Use teh mutall library to speeup saving   
    //-posts the message to all members of Mlima. This the task for the next
    //4 weeks
    //    --Develop link to our socket library
    async send_message() {
        //
        // Get the message to send
        const text = this.get_message();
        //
        // Display the text locally in message area
        this.display_message(text, this.user.name, this.standardise_date(new Date()));
        //
        //Save the message to the database
        await this.save_message(text);
        //
        // Post the text to the message area of 
        //everybody anywhwere who is currently logged in to the mlima 
        //application.
        this.post_message(text);
        //
        // Clear the message text-area to be ready for the next message
        this.clear_message_text_area();
    }
    // Post the text to the message area of everybody (anywhwere) 
    //who is currently logged in to the mlima application,using the socket 
    //technology
    post_message(text) {
        //Difine the steps for doing this with help from Peter
    }
    //
    // This method gets the message from the database
    async get_messages() {
        //
        // Get the sql file with the messages
        const messages = '/mlima/v/code/test.sql';
        //
        // Execute and get the database rows
        const rows = await server.exec('database', ['mutall_users'], 'get_sql_data', [messages, 'file']);
        return rows;
    }
    //
    // Display the given text in the message area. The intended html looks like this
    /*
    <div>
    <img class="photo_photo" src="$photo">
    <div id="message_div">
        <span class="username">${user}</span>
        <span class="date">${date}</span>
        <div class="text-container">
            <p class="text">${text}</p>
        </div>
    </div>
</div>


    */
    async display_message(text, user, date, photo = this.user.picture ?? 'default.jpg') {
        //
        //
        const message_element = document.createElement("div");
        //
        //message_element.innerHTML = `User: ${user}<br/>${text}<br/>${date}`;
        // Create a housing for the user name text.
        //
        this.create_element('img', message_element, {
            class: 'photo_photo',
            src: photo
        });
        // Create a div element with the specified ID
        const messageDiv = this.create_element('div', message_element, {
            id: 'message_div' // Replace 'yourDivId' with the desired ID
        });
        // Create a username container
        this.create_element('span', messageDiv, {
            class: 'username',
            textContent: ` ${user}`
        });
        // Create a text container
        this.create_element('span', messageDiv, {
            class: 'text',
            textContent: text // Assuming text is the variable containing the text message
        });
        // Create a date container
        this.create_element('span', messageDiv, {
            class: 'date',
            textContent: ` ${date}`
        });
        //
        // Get the element whetre to put the message text.
        const message_output = document.getElementById("message_output");
        //
        //Attach the message element to the output.
        message_output?.appendChild(message_element);
        //
        //Let the message element be visible
        message_element.scrollIntoView({ block: "end" });
    }
    //
    // Method for clearing the message text area
    clear_message_text_area() {
        //
        //the variable of getting the mesage text area
        const message_text_area = document.getElementById("message_text_area");
        //
        //condititional statement
        if (message_text_area)
            message_text_area.value = "";
        //
    }
    // Method for getting the message from the textarea
    get_message() {
        // find an HTML element with the id attribute set to "message_text_area"
        // in the current web page's document.
        //
        const area = document.getElementById("message_text_area");
        //In simple terms, this code checks if a specific HTML element with the 
        //ID "message_text_area" exists on the web page. If it doesn't exist 
        //(i.e., area is null), 
        //it raises an error to indicate that the expected HTML element is missing.
        //
        if (area === null)
            throw 'Text area not found';
        // check if the HTML element stored in the area variable is not a 
        //textarea element.
        // If it's not a textarea element, it raises an error to 
        //indicate that the element is not of the expected type 
        //(i.e., it's not a textarea).
        //
        if (!(area instanceof HTMLTextAreaElement))
            throw 'Element not a text area';
        //
        return area.value;
    }
    async initialize_page() {
        const current_user = this.register.get_current_user();
        //        //
        //        // if the is a 
        //        if (current_user){
        //            //
        //            this.get_element("Login").hidden;
        //            //
        //            this.welcome(current_user);
        //        }
        const loginButton = document.getElementById("Login");
        const messageTextArea = document.getElementById("message_text_area");
        if (loginButton && messageTextArea) {
            loginButton.addEventListener("click", () => {
                loginButton.style.display = "none";
                // messageTextArea.disabled = false;
            });
            // Assuming you have a variable named "userIsLoggedIn" that indicates whether the user is logged in
            const userIsLoggedIn = false /* Assign your login status logic here,
                     e.g., userIsLoggedIn = true or false */;
            if (!current_user) {
                messageTextArea.disabled = true;
            }
        }
        //Get the messages from the database
        const text_message = await this.get_messages();
        //
        // Display the texts from the database 
        text_message.forEach((message) => this.display_message(message.text, message.name, message.date, message.photo));
    }
    // Method to handle user logout
    logout_user() {
        // Perform logout actions here
        // For example, you can clear user authentication, clear session data, or perform other logout-related tasks
        // For now, let's simulate a logout by showing an alert
        //alert('You have been logged out.');
        this.register.logout();
        //        alert('You have been logged out.');
        // Hide the button after logout
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.style.display = 'none';
            // Hide the text in the "welcome" div
            const welcomeDiv = document.getElementById('welcome');
            if (welcomeDiv) {
                welcomeDiv.textContent = ''; // Set the text content to an empty string
            }
        }
    }
    // Method to handle user login
    login_user() {
        // Perform login actions here
        // For example, you can show the login form, set user authentication, or perform other login-related tasks
        // For now, let's simulate a login by showing an alert
        //        alert('You have logged in.');
        // Show the "Log Out" button
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.style.display = 'block'; // Cast to HTMLElement
        }
        // Hide the "Log In" button
        const loginButton = document.querySelector('button[text="Log In"]');
        if (loginButton) {
            loginButton.style.display = 'none'; // Cast to HTMLElement
        }
    }
    // Method to create the logout button and set up the event listener
    createLogoutButton() {
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Log Out';
        logoutButton.id = 'logout-button'; // Add an ID to the button for easier identification
        // Add an event listener to the button to handle the sign-out action
        logoutButton.onclick = () => this.logout_user();
        // Append the button to a container element in your HTML, e.g., document.body
        this.get_element('welcome').appendChild(logoutButton);
    }
    sendMessage() {
        // Logic to send the message...
        // Clear the text area after sending the message
        const messageTextArea = document.getElementById('message_text_area');
        if (messageTextArea) {
            messageTextArea.value = ''; // This line clears the text area
        }
    }
}
// Attaching the function to an event listener or button click
window.onload = () => {
    const page = new MlimaPage();
    // Other initialization code
    const sendButton = document.getElementById('send_button');
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            page.sendMessage();
        });
    }
};
class MlimaPage {
    // ... other methods and properties
    sendMessage() {
        // Logic to send the message...
        // Clear the text area after sending the message
        const messageTextArea = document.getElementById('message_text_area');
        if (messageTextArea) {
            messageTextArea.value = ''; // This line clears the text area
        }
    }
}
// Attaching the function to an event listener or button click
window.onload = () => {
    const page = new MlimaPage();
    // Other initialization code
    const sendButton = document.getElementById('send_button');
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            page.sendMessage();
        });
    }
};
