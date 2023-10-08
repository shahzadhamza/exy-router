# exy-router

**exy-router** is a modified version of the popular Express.js router with enhanced functionality for request and response validation using [Ajv.js](https://ajv.js.org/). It automatically generates OpenAPI documentation based on JSON schemas, simplifying API documentation tasks.

## Features

- **Request Validation**: Validate request bodies, parameters, and query strings against JSON schemas using Ajv.js.
- **Response Validation**: Validate response JSON data against a JSON schema.
- **OpenAPI Documentation**: Automatically generate OpenAPI documentation based on your route configurations and JSON schemas.
- **Express.js Compatibility**: exy-router maintains compatibility with Express.js, making it easy to integrate into existing Express applications.
- **Middleware Support**: Use middleware functions with exy-router for authentication, logging, and more.
- **Easy to Use**: Define routes and schema validations with a simple and intuitive syntax.

## Installation

Install exy-router using npm:

```bash
npm install exy-router --save
```

## Usage

Here's a quick example of how to set up a route with request and response validation and OpenAPI documentation:

```javascript
const express = require("express");
const cors = require("cors");
const createRouter = require("exy-router");

const app = express();
const router = createRouter(express.Router)();

app.use(express.json());
app.use(cors());

// Setup OpenAPI
router.setupDocs("/api-docs", {
  openapi: "3.1.0",
  info: {
    title: "exy-router",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://127.0.0.1:3000/api",
      description: "Production server (uses live data)",
    },
  ],
});

// Define a schema for request validation
const requestSchema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 3 },
    password: { type: "string", minLength: 8 },
  },
  required: ["username", "password"],
};

// Define a schema for response validation
const responseSchema = {
  type: "object",
  description: "Logged in successfully",
  properties: {
    message: { type: "string" },
  },
  required: ["message"],
};

// Create a route with request and response validation
router.post(
  "/login",
  {
    schema: {
      body: requestSchema,
      response: {
        200: responseSchema,
      },
    },
  },
  (req, res) => {
    // Your route logic here
    res.json({ message: "Logged in successfully" });
  }
);

// Create a route with params validation
router.get(
  "/product/:id",
  {
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      response: {
        200: {
          description: "This API will return your product id",
        },
      },
    },
  },
  (req, res) => {
    // Your route logic here
    res.json({ message: `Your product id is ${req.params.id}` });
  }
);

// Create a route with query string validation
router.get(
  "/order",
  {
    schema: {
      query: {
        type: "object",
        properties: {
          id: { type: "string" },
          page: { type: "string" },
        },
        required: ["id"],
      },
    },
  },
  (req, res) => {
    // Your route logic here
    res.json({ message: `Your order id is ${req.query.id}` });
  }
);

app.use("/api", router);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

## Documentation

For JSON Schema documentation and examples, please visit [json-schema.org](https://json-schema.org/learn/getting-started-step-by-step)

## Contributing

We welcome contributions from the community! If you'd like to contribute to exy-router, please [email us](mailto:js.specialist@gmail.com).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

This package is inspired by [Fastify.js](https://fastify.dev/).
Special thanks to the open-source community for their contributions and support.
