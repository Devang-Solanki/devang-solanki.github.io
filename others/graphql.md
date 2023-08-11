# What is GraphQL

As per graphql.org :
> GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.  
  
Let's simplify this definition; GraphQL is very similar to ordering food at Subway. At subway you have the power to ask the server exactly what you want to eat. You can specify the type of bread, the ingredients, and any specific sauce you want. Then the server gives you exactly what you asked for.  
  
In the same way, GraphQL is a query language that allows you to request data from a server. Instead of getting a fixed set of data, like in traditional APIs, you can send a query to the server specifying exactly what data you need. You define the structure of the data you want and the server responds with that specific data, nothing more and nothing less.  
  
GraphQL lets you ask for data more specifically, like ordering food at a restaurant. With GraphQL, you can avoid over-fetching (getting more data than you need) or under-fetching (making multiple requests to get all the necessary data). This is achieved using a well-defined schema that specifies the data requirements.

## GraphQL Operations

A GraphQL operation is a request made to a GraphQL server to perform a specific action, such as retrieving data (query) or modifying data (mutation). It follows a structured syntax and is defined using the GraphQL query language.

GraphQL operations consist of the following components:

1. Operation Type:

- **Query**: Used for retrieving data from the server.
- **Mutation**: Used for modifying data on the server.
- **Subscription**: Used for establishing a real-time connection to receive data updates.

2. Operation Name:

- A user-defined name given to the operation. It helps in identifying and referencing the operation when needed.

3. Selection Set:

- A set of fields that define the specific data requirements for the operation and nothing more, avoiding **over-fetching** and **under-fetching** of data.
- A selection set is primarily composed of **fields**. Each field represents a piece of data to be retrieved or modified.
- Fields can have arguments to provide additional parameters for filtering or sorting.
- By default, a field's response key in the response object will use that field's name. However, you can define a different response key by specifying an alias

4. Variables:

- Optional variables that can be used to parameterize the operation.
- Variables help make the operation dynamic and reusable by allowing values to be provided at runtime.

![](https://i.ibb.co/86nVfyr/grapql.png)

In the above example:

- Operation Type: "query" signifies it is a read operation.
- Operation Name: "GetBook" represents the name given to the operation.
- Selection Set: The fields within the "book" field specify the desired data (title, author, publicationYear).
- Variables: "$bookId" is a variable of type "ID!" (non-null ID) used as an argument to fetch a specific book. Its actual value is provided at runtime.

5. Fragments :

- Fragments are used in GraphQL to reduce duplication and reuse common field selections in queries.
- They allow you to define a set of fields once and include them in multiple queries.
- By using fragments, you can make your queries more concise and maintainable.

![](https://i.ibb.co/bb5nfFC/fragment.png)

In the above example, the `userFields` fragment is defined once and can be reused in `GetUser` queries, reducing duplication, and improving maintainability.


## What is Schema?
GraphQL schemas play an important role in GraphQL server implementations. They serve as a blueprint that defines the operation accessible to clients when querying the server.

A schema defines the types and relationships within a GraphQL API. It outlines the object types and specifies how fields on those types are related to one another. In addition to defining types and relationships, a GraphQL schema also defines queries, mutations, and subscriptions.

```graphql
type Query {
  hello: String
  user(id: ID!): User
}

type User {
  id: ID!
  name: String!
  email: String!
}
```
In this example, we have a basic schema with two types: `Query` and `User`.

The `Query` type represents the entry point for fetching data from the server. It has two fields: `hello` and `user`. The `hello` field returns a `String`, and the `user` field accepts an `id` argument of type `ID` and returns a `User` object.

The `User` type defines the structure of a user object. It has three fields: `id`, `name`, and `email`. The `id` field is of type `ID!`, which indicates that it's a non-null field and must always have a value. Similarly, the `name` and `email` fields are of type `String!`, indicating non-null strings.

With this schema, you can query the server for the `hello` field to get a string response or use the `user` field with an `id` argument to retrieve a specific user object with their `id`, `name`, and `email` information or both.

## Understanding the Difference Between Queries and Mutations in GraphQL

In GraphQL, queries and mutations are two essential concepts that allow clients to interact with the server's data. While they serve a similar purpose of fetching and modifying data, there are important distinctions between the two. This section aims to clarify the differences between queries and mutations in GraphQL.

### Queries:
Queries in GraphQL are used to fetch data from the server. They resemble GET requests in traditional RESTful APIs. Here are some key characteristics of queries:

- Read Operations: Queries are designed for retrieving data, making them read-only operations.
- Multiple Fields: Queries can request multiple fields of different types within a single request.
- Hierarchical Structure: GraphQL queries have a hierarchical structure, meaning that clients can specify the exact shape and structure of the response they want.
- No Side Effects: Queries should not cause any side effects on the server or modify data.

Example:
Consider an e-commerce application. A query to fetch product details might look like this:

```graphql
query GetProduct {
    product(id: "123") {
        name
        price
        description
        reviews {
            author
            rating
            comment
        }
    }
}
```

In this example, the query is requesting the name, price, description, and reviews of a specific product with the given ID.

### Mutations:
Mutations in GraphQL are used to modify data on the server. They resemble POST, PUT, PATCH, or DELETE requests in traditional RESTful APIs. Here are some key characteristics of mutations:

- Write Operations: Mutations are intended for modifying data on the server, such as creating, updating, or deleting resources.
- Single Entry Point: Mutations are executed one at a time and are typically defined as discrete operations.
- Arguments: Mutations can take input arguments to specify the data to be modified.
- Result: Mutations return a result, which can include information about the changed data.

Example:
Using the same e-commerce application, a mutation to create a new product might look like this:

```graphql
mutation {
    createProduct(input: {
        name: "New Product"
        price: 99.99
        description: "A great new product"
}) {
        id
        name
        price
    }
}
```
In this example, the mutation is creating a new product with the specified name, price, and description. The server responds with the ID, name, and price of the newly created product.

## What are Subscriptions in GraphQL? 
Subscriptions are a type of GraphQL operation that allows clients to receive real-time updates from the server. Unlike queries and mutations that are request-response based, subscriptions establish a persistent connection over WebSocket or other supported protocols. This connection enables the server to push data updates to clients as soon as they occur, providing a seamless real-time experience.

## What is Introspection?
In the previous section, we disscused about GraphQL schema, which serves as a blueprint defining the operations accessible to clients. Now, to gain insight into this schema, GraphQL offers a powerful feature called "Introspection."

Introspection allows clients to query the GraphQL server about its schema. With Introspection we can discover and explore the entire API surface, making it easier to understand and interact with the available data and operations. Using introspection, hackers can explore the types, fields, and relationships defined in the schema, queries, and mutations.

We can get the schema of GraphQL by querying the `__schema` field, always available on the root type of a Query. Let's understand this by a simple example.

Introspection query to get all types:

`Query`

```graphql
query AllTypesQuery {
  __schema {
    types {
      name
    }
  }
}
```
`Response`

```json
{
  "data": {
    "__schema": {
      "types": [
        {
          "name": "Query"
        },
        {
          "name": "String"
        },
        {
          "name": "ID"
        },
        {
          "name": "Mutation"
        },
        {
          "name": "Episode"
        },
        {
          "name": "Boolean"
        }
      ]
    }
  }
}
```

Explanation:

-   The `types` field inside `__schema` provides information about all the types in the schema, including object types, scalar types, enum types, and interface types.
-   For each type, we are requesting its `name` .
-   `name` represents the name of the type.

`Query`

```graphql
query IntrospectionQuery {
  __schema {
    queryType {
      name
    }
    mutationType {
      name
    }
    subscriptionType {
      name
    }
  }
}
```
`Response`
```json
{
  "__schema": {
    "types": [
      {
        "name": "Query",
        "kind": "OBJECT"
      },
      {
        "name": "Mutation",
        "kind": "OBJECT"
      },
      {
        "name": "Subscription",
        "kind": "OBJECT"
      },
      {
        "name": "User",
        "kind": "OBJECT"
      },
      {
        "name": "Post",
        "kind": "OBJECT"
      },
      {
        "name": "ID",
        "kind": "SCALAR"
      },
      {
        "name": "String",
        "kind": "SCALAR"
      }
    ]
  }
}

```

And with the below query the server should respond with the full schema. Reading the json body can be painful. You use tools such as [GraphQL Voyager](https://apis.guru/graphql-voyager/) to visualize the schema.

```graphql
{__schema{queryType{name}mutationType{name}subscriptionType{name}types{...FullType}directives{name description locations args{...InputValue}}}}fragment FullType on __Type{kind name description fields(includeDeprecated:true){name description args{...InputValue}type{...TypeRef}isDeprecated deprecationReason}inputFields{...InputValue}interfaces{...TypeRef}enumValues(includeDeprecated:true){name description isDeprecated deprecationReason}possibleTypes{...TypeRef}}fragment InputValue on __InputValue{name description type{...TypeRef}defaultValue}fragment TypeRef on __Type{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}}}}}
```

### Get Schema if Introspection is disabled
Having the schema makes it simpler for us to exploit it since we have the schema and know which queries and mutations are accessible. What if introspection is disabled?

By default, GraphQL server comes with an in-built capability to hint at the correct field names to use in either queries or mutations if the wrong ones are specified in the request. 

![Field Suggestions](https://i.ibb.co/tz9M9tJ/Screenshot-2023-07-21-170431.png)
> 🛑NOTE: This is not a vulnerability; its a feature which we can leverage to see graphql schema. So don't report this to bug bounty platforms.

By leveraging this capability, an attacker could conduct a bruteforce attack to discover the GraphQL schema. 

I will list some tools that can be used to automate this :
-   Clairvoyance : [https://github.com/nikitastupin/clairvoyance](https://github.com/nikitastupin/clairvoyance)
-   GraphQLmap : [https://github.com/swisskyrepo/GraphQLmap](https://github.com/swisskyrepo/GraphQLmap)

Another simple way to get queries and mutations when introspection is disabled is by looking into javascript code. For making request via browser developers, hardcode queries and mutation into javascript code. By digging into javascript you can get queries and mutations. By utilizing burp search feature you can search for keywords like `query` & `mutation` . If you don't have Burp Pro license you can use firefox console and visit `Debuger` tab and search for the keywords, and from chrome you can do this by using `Sources` tab

 
## Abusing GraphQL Batching

GraphQL batching is an optimization technique that allows multiple GraphQL queries to be merged and sent together in a single request. Upon reaching the server, all the queries in the batch are executed one after another.

Since GraphQL allows batching, an attacker can craft multiple `login` mutation requests with different OTP codes in a single batch. The attacker could send an array of `login` mutations, each with a different OTP code, to the server in one HTTP request.

```graphql
[
  {
    "query": "mutation { login( otp: '111111' ) { accessToken expiresAt }}"
  },
  {
    "query": "mutation { login( otp: '222222' ) { accessToken expiresAt }}"
  },
  {
    "query": "mutation { login( otp: '333333' ) { accessToken expiresAt }}"
  }
...
]
```
If the server had proper rate limits in place then we would fail this bruteforce attack after 5-10 attempts but using graphql we can try every combination in just one single request and the server would process each query one after another bypassing rate limit.

We could also use alias to exploit this. A payload using an alias would look like this:

```graphql
mutation {
    login(otp: '111111')
    second: login(otp: '222222')
    third: login(otp: '33333')
    ...
}
```

## Common Weaknesses in GraphQL and REST APIs
Vulnerabilities such as IDOR, SQLi and CSRF are present in Graphql, just as with REST APIs. Graphql is not inherently secure; it is merely a query language. To execute a query, developers must write resolver functions which then execute the query on the backend. These resolvers can create human errors which often lead to access control issues and privilege escalation.

**Example Scenario: A Note-Taking Application**

Consider a simple GraphQL API for a note-taking application where users can create, read, update, and delete their notes. Each note has an `id`, `title`, `content`, and `userId` to associate it with the creator.

**1. Vulnerable Query - Read Note:**

A typical GraphQL query to read a user's note might look like this:
```graphql
query {
  noteById(id: "123") {
    id
    title
    content
  }
}
```
In this query, the `noteById` field fetches the note by its `id`. However, if proper authorization and access control checks are not in place, an attacker can easily modify the `id` parameter and request notes that belong to other users.

**2. Vulnerable Mutation - Modify Note:**
A simple GraphQL query to modify a user's note might look like this:
```graphql
mutation {
  editNote(id: "123", content: "This book is great!") {
    id
    title
    content
   }
}
```
In this mutation , the `editNote` field edits the content of note by its `id`. However, if proper authorization and access control checks are not in place, an attacker can easily modify the `id` parameter and change notes that belong to other users.

If the user input is not sanitized properly, it can lead to **SQL/NoSQL injection** as developers may write resolver functions which can execute queries on database.

**CSRF** attacks are also possible against GraphQL APIs that rely on the cookie for authentication. Consider a scenario where a GraphQL API has a mutation that allows users to update their profile information:
```graphql
mutation {
  updateProfile(name: "New Name", email: "new@email.com") {
    id
    name
    email
  }
}
```

If authentication is done via cookies, and the application is using a GET or POST based form to query the GraphQL endpoint, you can exploit CSRF using a normal HTTP form.

For example: 
Consider this two request GET & POST 

```http
GET /graphql?query=mutation+%7B+updateProfile%28name%3A+%27Attacker%27%2C+email%3A+%27attacker%40email.com%27%29+%7B+id+name+email+%7D+%7D HTTP/1.1

Accept-Encoding: gzip, deflate
Accept: */*
Connection: close
```

```http
POST /graphql HTTP/1.1
Host: example.com
User-Agent: i am vengeance
Accept-Encoding: gzip, deflate
Accept: */*
Connection: close
Content-Length: 125
Content-Type: application/x-www-form-urlencoded

query=mutation+%7B+updateProfile%28name%3A+%27Attacker%27%2C+email%3A+%27attacker%40email.com%27%29+%7B+id+name+email+%7D+%7D
```
An attacker can perform CSRF by crafting a simple HTML form that automatically submits a mutation request to update the user's profile.

However, many times developers use a JSON body to send GraphQL queries to the backend. In that case, if the content-type is not properly validated, then you can exploit this by crafting an XHR/Fetch request using Javascript. And if the content-type is properly validated, then you have to rely on CORS misconfiguration.

## Some Useful Tools
- Clairvoyance : [https://github.com/nikitastupin/clairvoyance](https://github.com/nikitastupin/clairvoyance)
- GraphQLmap : [https://github.com/swisskyrepo/GraphQLmap](https://github.com/swisskyrepo/GraphQLmap)
- InQL: [https://github.com/doyensec/inql](https://github.com/doyensec/inql)
- Altair: [https://altairgraphql.dev/](https://altairgraphql.dev/)
- GraphQL Voyager :[https://apis.guru/graphql-voyager/](https://apis.guru/graphql-voyager)
- Graphql.Security: [https://graphql.security/](https://graphql.security/)
