function getResponses(responseSchema) {
  const responses = {};
  for (let statusCode in responseSchema) {
    if (responseSchema[statusCode]?.description) {
      responses[statusCode] = {
        description: responseSchema[statusCode].description,
      };
    }
  }
  return responses;
}

const d = {
  spec: {
    openapi: "3.1.0",
    info: {
      title: "exy-router",
      version: "1.0.0",
    },
    schemes: ["https", "http"],
    paths: {},
    components: {
      schemas: {},
    },
  },
  init(options) {
    d.spec = { ...d.spec, ...options };
  },
  addSpec(path, method, data) {
    if (!path && !method) {
      return;
    }
    const definition = {};
    definition.tags = data?.schema?.tags || [];
    definition.summary = data?.schema?.summary || "";
    definition.parameters = [];
    if (data?.schema?.query) {
      const q = data.schema.query;
      for (key in q.properties) {
        definition.parameters.push({
          in: "query",
          name: key,
          required: q.required?.includes(key),
          schema: q.properties[key],
        });
      }
    }
    if (data?.schema?.params) {
      const q = data.schema.params;
      for (key in q.properties) {
        definition.parameters.push({
          in: "path",
          name: key,
          required: q.required?.includes(key),
          schema: q.properties[key],
        });
      }
    }
    if (data?.schema?.body) {
      definition.requestBody = {
        content: {
          "application/json": {
            schema: data?.schema?.body,
          },
        },
      };
      const schemaTitle = data?.schema?.title || path;
      d.spec.components.schemas[schemaTitle] = data?.schema?.body;
    }
    definition.responses = getResponses(data?.schema?.response);
    d.spec.paths[path] = {
      [method]: definition,
    };
  },
};

module.exports = d;
