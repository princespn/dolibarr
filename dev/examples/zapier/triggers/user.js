const subscribeHook = (z, bundle) => {
    // `z.console.log()` is similar to `console.log()`.
    z.console.log('suscribing hook!');

    // bundle.targetUrl has the Hook URL this app should call when an action is created.
    const data = {
        url: bundle.targetUrl,
        event: bundle.event,
        module: 'user',
        action: bundle.inputData.action
    };

    const url = bundle.authData.url  + '/api/index.php/zapier/hook';

    // You can build requests and our client will helpfully inject all the variables
    // you need to complete. You can also register middleware to control this.
    const options = {
        url: url,
        method: 'POST',
        body: data,
    };

    // You may return a promise or a normal data structure from any perform method.
    return z.request(options).then((response) => JSON.parse(response.content));
};

const unsubscribeHook = (z, bundle) => {
    // bundle.subscribeData contains the parsed response JSON from the subscribe
    // request made initially.
    z.console.log('unsuscribing hook!');

    // You can build requests and our client will helpfully inject all the variables
    // you need to complete. You can also register middleware to control this.
    const options = {
        url: bundle.authData.url + '/api/index.php/zapier/hook/' + bundle.subscribeData.id,
        method: 'DELETE',
    };

    // You may return a promise or a normal data structure from any perform method.
    return z.request(options).then((response) => JSON.parse(response.content));
};

const getUser = (z, bundle) => {
    // bundle.cleanedRequest will include the parsed JSON object (if it's not a
    // test poll) and also a .querystring property with the URL's query string.
    const user = {
        id: bundle.cleanedRequest.id,
        lastname: bundle.cleanedRequest.lastname,
        firstname: bundle.cleanedRequest.firstname,
        address: bundle.cleanedRequest.address,
        zip: bundle.cleanedRequest.zip,
        town: bundle.cleanedRequest.town,
        email: bundle.cleanedRequest.email,
        login: bundle.cleanedRequest.login,
        authorId: bundle.cleanedRequest.authorId,
        createdAt: bundle.cleanedRequest.createdAt,
        action: bundle.cleanedRequest.action
    };

    return [user];
};

const getFallbackRealUser = (z, bundle) => {
    // For the test poll, you should get some real data, to aid the setup process.
    const module = bundle.inputData.module;
    const options = {
        url: bundle.authData.url + '/api/index.php/users/0',
    };

    return z.request(options).then((response) => [JSON.parse(response.content)]);
};

// const getModulesChoices = (z/*, bundle*/) => {
//     // For the test poll, you should get some real data, to aid the setup process.
//     const options = {
//         url: bundle.authData.url + '/api/index.php/zapier/getmoduleschoices',
//     };

//     return z.request(options).then((response) => JSON.parse(response.content));
// };
// const getModulesChoices = () => {

//     return {
//         orders: "Order",
//         invoices: "Invoice",
//         thirdparties: "Thirdparty",
//         users: "User",
//         contacts: "Contacts"
//     };
// };

// const getActionsChoices = (z, bundle) => {
//     // For the test poll, you should get some real data, to aid the setup process.
//     const module = bundle.inputData.module;
//     const options = {
//         url:  url: bundle.authData.url + '/api/index.php/zapier/getactionschoices/thirparty`,
//     };

//     return z.request(options).then((response) => JSON.parse(response.content));
// };

// We recommend writing your triggers separate like this and rolling them
// into the App definition at the end.
module.exports = {
    key: 'user',

    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'User',
    display: {
        label: 'New User',
        description: 'Triggers when a new user action is done in Dolibarr.'
    },

    // `operation` is where the business logic goes.
    operation: {

        // `inputFields` can define the fields a user could provide,
        // we'll pass them in as `bundle.inputData` later.
        inputFields: [
            {
                key: 'action',
                required: true,
                type: 'string',
                helpText: 'Which action of user this should trigger on.',
                choices: {
                    create: "Create",
                    modify: "Modify",
                    validate: "Validate",
                }
            }
        ],

        type: 'hook',

        performSubscribe: subscribeHook,
        performUnsubscribe: unsubscribeHook,

        perform: getUser,
        performList: getFallbackRealUser,

        // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
        // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
        // returned records, and have obviously dummy values that we can show to any user.
        sample: {
            id: 1,
            createdAt: 1472069465,
            lastname: 'DOE',
            firstname: 'John',
            email: 'john@doe.com',
            address: 'Park Avenue',
            zip: '12345',
            town: 'NEW-YORK',
            login: 'doe.john',
            authorId: 1,
            action: 'create'
        },

        // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
        // field definitions. The result will be used to augment the sample.
        // outputFields: () => { return []; }
        // Alternatively, a static field definition should be provided, to specify labels for the fields
        outputFields: [
            {key: 'id', type: "integer", label: 'ID'},
            {key: 'createdAt', type: "integer", label: 'Created At'},
            {key: 'lastname', label: 'Lastname'},
            {key: 'firstname', label: 'Firstname'},
            {key: 'email', label: 'Email'},
            {key: 'address', label: 'Address'},
            {key: 'zip', label: 'Zip'},
            {key: 'town', label: 'Town'},
            {key: 'login', label: 'Login'},
            {key: 'authorId', type: "integer", label: 'Author ID'},
            {key: 'action', label: 'Action'}
        ]
    }
};
