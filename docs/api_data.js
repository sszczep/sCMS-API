define({ "api": [  {    "type": "post",    "url": "/auth/login",    "title": "Login into site using credentials (email and password)",    "name": "Login",    "group": "Auth",    "parameter": {      "fields": {        "JSON Payload": [          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "email",            "description": "<p>Email</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "password",            "description": "<p>Password</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>User object</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.token",            "description": "<p>JWT token</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/auth.js",    "groupTitle": "Auth",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "post",    "url": "/auth/register",    "title": "Register new user",    "name": "Register",    "group": "Auth",    "parameter": {      "fields": {        "JSON Payload": [          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "email",            "description": "<p>Email</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "password",            "description": "<p>Password</p>"          }        ]      }    },    "success": {      "fields": {        "Success 201": [          {            "group": "Success 201",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>User object</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.token",            "description": "<p>JWT token</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/auth.js",    "groupTitle": "Auth",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/autocomplete/:phrase",    "title": "Get list of all users/posts containing given phrase",    "name": "GetContainingPhrase",    "group": "Autocomplete",    "parameter": {      "fields": {        "Route Parameter": [          {            "group": "Route Parameter",            "type": "String",            "size": "3..",            "optional": false,            "field": "phrase",            "description": "<p>Phrase to look for</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "data",            "description": "<p>Array of entries</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.name",            "description": "<p>Name of entry</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.subtext",            "description": "<p>Subtext of entry</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.avatar",            "description": "<p>Avatar of entry (avatar of user or thumbnail of post)</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.url",            "description": "<p>Url of entry</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/autocomplete.js",    "groupTitle": "Autocomplete",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/me",    "title": "Get user's details based on given token",    "name": "Me",    "group": "Me",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "user",            "description": "<p>User's details</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/me.js",    "groupTitle": "Me",    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Authorization header</p>"          }        ]      },      "examples": [        {          "title": "Authorization example:",          "content": "{\n  \"Authorization\": \"Bearer <jwt token here>\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "post",    "url": "/options",    "title": "Create new option",    "name": "CreateOption",    "group": "Options",    "parameter": {      "fields": {        "JSON Payload": [          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "key",            "description": "<p>Name of option</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "value",            "description": "<p>Value of option</p>"          }        ]      }    },    "success": {      "fields": {        "Success 201": [          {            "group": "Success 201",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Newly created option</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.key",            "description": "<p>Name of option</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.value",            "description": "<p>Value of option</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/options.js",    "groupTitle": "Options",    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Authorization header</p>"          }        ]      },      "examples": [        {          "title": "Authorization example:",          "content": "{\n  \"Authorization\": \"Bearer <jwt token here>\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "delete",    "url": "/options/:key",    "title": "Delete single option",    "name": "DeleteOption",    "group": "Options",    "parameter": {      "fields": {        "Route Parameter": [          {            "group": "Route Parameter",            "type": "String",            "optional": false,            "field": "key",            "description": "<p>Name of option</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "null",            "optional": false,            "field": "null",            "description": "<p>No response data</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/options.js",    "groupTitle": "Options",    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Authorization header</p>"          }        ]      },      "examples": [        {          "title": "Authorization example:",          "content": "{\n  \"Authorization\": \"Bearer <jwt token here>\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/options/:key",    "title": "Get single option",    "name": "GetOption",    "group": "Options",    "parameter": {      "fields": {        "Route Parameter": [          {            "group": "Route Parameter",            "type": "String",            "optional": false,            "field": "key",            "description": "<p>Name of option</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Option object</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.key",            "description": "<p>Name of option</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.value",            "description": "<p>Value of option</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/options.js",    "groupTitle": "Options",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/options",    "title": "Get list of all options",    "name": "GetOptions",    "group": "Options",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "data",            "description": "<p>Array of options</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.key",            "description": "<p>Name of option</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.value",            "description": "<p>Value of option</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/options.js",    "groupTitle": "Options",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "put",    "url": "/options/:key",    "title": "Update single option",    "name": "UpdateOption",    "group": "Options",    "parameter": {      "fields": {        "Route Parameter": [          {            "group": "Route Parameter",            "type": "String",            "optional": false,            "field": "key",            "description": "<p>Name of option</p>"          }        ],        "JSON Payload": [          {            "group": "JSON Payload",            "type": "String",            "optional": true,            "field": "newKey",            "description": "<p>New name of option</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": true,            "field": "newValue",            "description": "<p>New value of option</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Object of updated option</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.key",            "description": "<p>New name of option</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.value",            "description": "<p>New value of option</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/options.js",    "groupTitle": "Options",    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Authorization header</p>"          }        ]      },      "examples": [        {          "title": "Authorization example:",          "content": "{\n  \"Authorization\": \"Bearer <jwt token here>\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "post",    "url": "/posts",    "title": "Create new post",    "name": "CreatePost",    "group": "Posts",    "parameter": {      "fields": {        "JSON Payload": [          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "title",            "description": "<p>Title of post</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "description",            "description": "<p>Description of post</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "author",            "description": "<p>Author of post</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "content",            "description": "<p>Content of post</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "thumbnail",            "description": "<p>Thumbnail of post</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": true,            "field": "friendlyUrl",            "description": "<p>Custom friendly url of post</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": true,            "field": "created",            "description": "<p>Date of creation</p>"          }        ]      }    },    "success": {      "fields": {        "Success 201": [          {            "group": "Success 201",            "type": "Object",            "optional": false,            "field": "data",            "description": ""          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.title",            "description": "<p>Title of post</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.description",            "description": "<p>Description of post</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.author",            "description": "<p>Author of post</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.content",            "description": "<p>Content of post</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.thumbnail",            "description": "<p>Thumbail of post</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.friendlyUrl",            "description": "<p>Friendly url of post</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.created",            "description": "<p>Date of creation</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/posts.js",    "groupTitle": "Posts",    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Authorization header</p>"          }        ]      },      "examples": [        {          "title": "Authorization example:",          "content": "{\n  \"Authorization\": \"Bearer <jwt token here>\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/posts/:id",    "title": "Get a single post",    "name": "GetPost",    "group": "Posts",    "parameter": {      "fields": {        "Route Parameter": [          {            "group": "Route Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>id of post to return</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": ""          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.title",            "description": "<p>Title of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.description",            "description": "<p>Description of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.author",            "description": "<p>Author of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.content",            "description": "<p>Content of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.thumbnail",            "description": "<p>Thumbail of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.friendlyUrl",            "description": "<p>Friendly url of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.created",            "description": "<p>Date of creation of post</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/posts.js",    "groupTitle": "Posts",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/posts?preview=:preview&limit=:limit&offset=:offset",    "title": "Get list of all posts",    "name": "GetPosts",    "group": "Posts",    "parameter": {      "fields": {        "Query Parameter": [          {            "group": "Query Parameter",            "type": "Boolean",            "optional": true,            "field": "preview",            "defaultValue": "false",            "description": "<p>If set to true, won't contain content</p>"          },          {            "group": "Query Parameter",            "type": "Number",            "optional": true,            "field": "limit",            "defaultValue": "0",            "description": "<p>How many posts should be shown (0 means all of them)</p>"          },          {            "group": "Query Parameter",            "type": "Number",            "optional": true,            "field": "offset",            "defaultValue": "0",            "description": "<p>How many posts should be skipped</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "data",            "description": "<p>Array of posts</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.title",            "description": "<p>Title of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.description",            "description": "<p>Description of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.author",            "description": "<p>Author of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.content",            "description": "<p>Content of post, only if preview is set to false</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.thumbnail",            "description": "<p>Thumbail of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.friendlyUrl",            "description": "<p>Friendly url of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.created",            "description": "<p>Date of creation of post</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/posts.js",    "groupTitle": "Posts",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/posts/count",    "title": "Get count of all posts",    "name": "GetPostsCount",    "group": "Posts",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": ""          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.count",            "description": "<p>Count of posts</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/posts.js",    "groupTitle": "Posts",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "post",    "url": "/socials",    "title": "Create new social link",    "name": "CreateSocialLink",    "group": "SocialLinks",    "parameter": {      "fields": {        "JSON Payload": [          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Name of social link</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "url",            "description": "<p>Url of social link</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "icon",            "description": "<p>Icon of social link</p>"          }        ]      }    },    "success": {      "fields": {        "Success 201": [          {            "group": "Success 201",            "type": "Object",            "optional": false,            "field": "data",            "description": ""          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.name",            "description": "<p>Name of social link</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.url",            "description": "<p>Url of social link</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.icon",            "description": "<p>Icon of social link</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/socials.js",    "groupTitle": "SocialLinks",    "header": {      "fields": {        "Header": [          {            "group": "Header",            "type": "String",            "optional": false,            "field": "Authorization",            "description": "<p>Authorization header</p>"          }        ]      },      "examples": [        {          "title": "Authorization example:",          "content": "{\n  \"Authorization\": \"Bearer <jwt token here>\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/socials",    "title": "Get list of social links",    "name": "GetSocialLinks",    "group": "SocialLinks",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "data",            "description": "<p>Array of social links</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.name",            "description": "<p>Name of social link</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.url",            "description": "<p>Url of social link</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.icon",            "description": "<p>Icon for social link</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/socials.js",    "groupTitle": "SocialLinks",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object[]",            "optional": false,            "field": "errors",            "description": "<p>Array of errors</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "errors.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "optional": false,            "field": "varname1",            "description": "<p>No type.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "varname2",            "description": "<p>With type.</p>"          }        ]      }    },    "type": "",    "url": "",    "version": "0.0.0",    "filename": "./docs/main.js",    "group": "_Users_sebastianszczepanski_Desktop_blog_api_sCMS_API_docs_main_js",    "groupTitle": "_Users_sebastianszczepanski_Desktop_blog_api_sCMS_API_docs_main_js",    "name": ""  }] });
