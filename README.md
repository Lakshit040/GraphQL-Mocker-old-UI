GraphQL Mocker is a Google Chrome plugin that allows software developers to mock GraphQL request responses. The plugin will provide the ability to intercept GraphQL requests made by the browser and return customizable mock responses, thereby enabling developers to test and debug their GraphQL-based applications more efficiently.

Some advantages this plugin brings with it for the developers:

Testing Complexity:

With MockGraphQL's request interception and mock response configuration, testing becomes seamless, reducing dependencies on actual server responses.

Error Simulation:

MockGraphQL enables effortless error simulation by allowing HTTP status code changes and introducing response delay to mimic real-life network conditions.

Data Availability and Sensitivity:

Generating mock data based on GraphQL schema and handling multiple requests simultaneously ensures data availability and integrity, even when actual server data is inaccessible or sensitive.

Application Robustness:

By validating responses against the GraphQL schema, MockGraphQL helps to enhance the robustness of the applications, ensuring that they handle various data scenarios appropriately.

--------Installation-------

Steps to follow to install this chrome plugin:

Go to chrome web store. On the search bar, type GraphQL Mocker and then press Enter You will see our extension, click on it and then click on "Add to chrome" option. Now, pin the extension by click on the extension icon on any chrome window. Now, you will be able to see the extension in the chrome devtools.
####### HAPPY MOCKING ########

-------Getting Started Guide--------

-------Intercepting Requests--------

For request interception, you didn't have to do much apart from enabling our extension, it will take care of the intercepted graphql requests. For intercepted requests, you won't see the entry in the Networks tab, as it's configuration and path is taken over by our extension.

------Configuring Mock Responses------

For setting mock responses:

Go to GraphQL Mocker tab in the chrome devtools. Just, create a new entry with the desired operation type and operation name. If you go inside this above operation panel, you will a default rule has been created for you. Just, give '*' as the rule entry. It is a wild-card character for rules. Now, go inside this rule panel, just copy and paste the mock response you want to set. Please, keep in mind to uncheck the 'Randomize Response' as this will indicate the generation of random response. Now, activate the rule by clicking on it's Play button and also, click on the 'Start Mocking' button in the 'Operation Panel'. Now, just make an gql operation and you will see the desired mock response that you have set. For disabling, this you just have to click on the 'Deactivate' button on this rule.
------Dynamic Response Generation-----

We have also provided the feature for the dynamic generation. The plugin can generate dynamic mock responses that change based on the values of variables present in the intercepted GraphQL queries. Using this, you can set rules depending on the variables that come along with the graphql request.

Any rule can involve primitive data types (string, number, boolean), objects (nested will also work) and arrays also. Rule can also involve all kind of comparision operators: ==, ===, !=, !==, >, <. >=, <= Also, you can set conditions connected by logical operators: &&, || We have also provided an option of universal rule in case that you don't want to apply any kind of rule, you can provide '*' (wild card) character. But make sure that all the variables must be present in the operation you want to mock, otherwise it will just give false and you will not be able to mock.
------Network Latency Simulation-----

You can also simulate the network latency that you want in your response. This feature will help test the application's behavior under slow network conditions.

Inside the rule panel, there is an option for introducing delay before the response. Just, provide the desired delay value you want in your response. (Default value is 0 ms delay).
------Random Data Generation------

Besides setting mock responses, you can also generate random response for your operations. Data is generated based on the GraphQL Schema, captured using the intercepted request details. This will provide developers with a quick and convenient way to populate mock responses.

Inside each rule, there is an option of 'Randomize Response'. Just, check this option to generate random responses. With every request it will generate unique random responses. (Default value is unchecked).
-----Status Code Customisation-----

We have also provided the ability to customize the HTTP status code returned in the mock response. This feature will enable developers to test error handling and different HTTP response scenarios.

Inside each rule, there is an entry for 'Status Code'. Just, provide the desired value of code that you want your response to return with. (Default value is HTTP code '200').
-------Data Validation-------

This feature is introduced to validate the generated dynamic responses and mock data against the GraphQL schema to ensure compatibility and adherence to the defined types and structures.

You don't have the ability to check/uncheck this feature, we have provided by default. Validation will be only of set mock responses (not in case of 'Random Generation').

-----Handling Multiple Requests------

The plugin is enhanced to handle multiple GraphQL requests simultaneously. This capability will ensure efficient mocking of responses when multiple requests are made concurrently.
