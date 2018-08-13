define({ "api": [  {    "type": "get",    "url": "/autocomplete/:phrase",    "title": "Get list of all users/posts containing given phrase",    "name": "GetContainingPhrase",    "group": "Autocomplete",    "parameter": {      "fields": {        "Route Parameter": [          {            "group": "Route Parameter",            "type": "String",            "size": "3..",            "optional": false,            "field": "phrase",            "description": "<p>Phrase to look for</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          },          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "data",            "description": "<p>Array of entries</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.name",            "description": "<p>Name of entry</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.subtext",            "description": "<p>Subtext of entry</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.avatar",            "description": "<p>Avatar of entry (avatar of user or thumbnail of post)</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.url",            "description": "<p>Url of entry</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/autocomplete.js",    "groupTitle": "Autocomplete",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "post",    "url": "/options",    "title": "Create new option",    "name": "CreateOption",    "group": "Options",    "parameter": {      "fields": {        "JSON Payload": [          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "key",            "description": "<p>Name of option</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "value",            "description": "<p>Value of option</p>"          }        ]      }    },    "success": {      "fields": {        "Success 201": [          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          },          {            "group": "Success 201",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Newly created option</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.key",            "description": "<p>Name of option</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.value",            "description": "<p>Value of option</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/options.js",    "groupTitle": "Options",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "delete",    "url": "/options/:key",    "title": "Delete single option",    "name": "DeleteOption",    "group": "Options",    "parameter": {      "fields": {        "Route Parameter": [          {            "group": "Route Parameter",            "type": "String",            "optional": false,            "field": "key",            "description": "<p>Name of option</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/options.js",    "groupTitle": "Options",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/options/:key",    "title": "Get single option",    "name": "GetOption",    "group": "Options",    "parameter": {      "fields": {        "Route Parameter": [          {            "group": "Route Parameter",            "type": "String",            "optional": false,            "field": "key",            "description": "<p>Name of option</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Option object</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.key",            "description": "<p>Name of option</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.value",            "description": "<p>Value of option</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/options.js",    "groupTitle": "Options",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/options",    "title": "Get list of all options",    "name": "GetOptions",    "group": "Options",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          },          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "data",            "description": "<p>Array of options</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.key",            "description": "<p>Name of option</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.value",            "description": "<p>Value of option</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/options.js",    "groupTitle": "Options",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "put",    "url": "/options/:key",    "title": "Update single option",    "name": "UpdateOption",    "group": "Options",    "parameter": {      "fields": {        "Route Parameter": [          {            "group": "Route Parameter",            "type": "String",            "optional": false,            "field": "key",            "description": "<p>Name of option</p>"          }        ],        "JSON Payload": [          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "newKey",            "description": "<p>New name of option</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "newValue",            "description": "<p>New value of option</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Object of updated option</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.key",            "description": "<p>New name of option</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.value",            "description": "<p>New value of option</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/options.js",    "groupTitle": "Options",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "post",    "url": "/pages",    "title": "Create new page",    "name": "CreatePage",    "group": "Pages",    "parameter": {      "fields": {        "JSON Payload": [          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Name of page</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "url",            "description": "<p>Url of page</p>"          }        ]      }    },    "success": {      "fields": {        "Success 201": [          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          },          {            "group": "Success 201",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Newly created page</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.name",            "description": "<p>Name of page</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.url",            "description": "<p>Url of page</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/pages.js",    "groupTitle": "Pages",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "delete",    "url": "/pages/:name",    "title": "Delete single page",    "name": "DeletePage",    "group": "Pages",    "parameter": {      "fields": {        "Route Parameter": [          {            "group": "Route Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Name of page</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/pages.js",    "groupTitle": "Pages",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/pages",    "title": "Get list of all pages",    "name": "GetPages",    "group": "Pages",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          },          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "data",            "description": "<p>Array of pages</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.name",            "description": "<p>Name of pages</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.url",            "description": "<p>Url of pages</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/pages.js",    "groupTitle": "Pages",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "put",    "url": "/pages/:name",    "title": "Update single page",    "name": "UpdatePage",    "group": "Pages",    "parameter": {      "fields": {        "Route Parameter": [          {            "group": "Route Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>Name of page</p>"          }        ],        "JSON Payload": [          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "newName",            "description": "<p>New name of page</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "newUrl",            "description": "<p>New url of page</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": "<p>Object of updated page</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.name",            "description": "<p>New name of page</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.url",            "description": "<p>New url of page</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/pages.js",    "groupTitle": "Pages",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "post",    "url": "/posts",    "title": "Create new post",    "name": "CreatePost",    "group": "Posts",    "parameter": {      "fields": {        "JSON Payload": [          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "title",            "description": "<p>Title of post</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "previewText",            "description": "<p>Preview text of post</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "author",            "description": "<p>Author of post</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "content",            "description": "<p>Content of post</p>"          },          {            "group": "JSON Payload",            "type": "String",            "optional": false,            "field": "thumbnail",            "description": "<p>Thumbnail of post</p>"          }        ]      }    },    "success": {      "fields": {        "Success 201": [          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          },          {            "group": "Success 201",            "type": "Object",            "optional": false,            "field": "data",            "description": ""          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.title",            "description": "<p>Title of post</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.previewText",            "description": "<p>Preview text of post</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.author",            "description": "<p>Author of post</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.content",            "description": "<p>Content of post</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.thumbnail",            "description": "<p>Thumbail of post</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.friendlyUrl",            "description": "<p>Friendly url of post</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.created",            "description": "<p>Date of creation of post</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/posts.js",    "groupTitle": "Posts",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/posts/:_id",    "title": "Get a single post",    "name": "GetPost",    "group": "Posts",    "parameter": {      "fields": {        "Route Parameter": [          {            "group": "Route Parameter",            "type": "String",            "optional": false,            "field": "_id",            "description": "<p>_id of post to return</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": ""          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.title",            "description": "<p>Title of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.previewText",            "description": "<p>Preview text of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.author",            "description": "<p>Author of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.content",            "description": "<p>Content of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.thumbnail",            "description": "<p>Thumbail of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.friendlyUrl",            "description": "<p>Friendly url of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.created",            "description": "<p>Date of creation of post</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/posts.js",    "groupTitle": "Posts",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/posts?preview=:preview&limit=:limit&offset=:offset",    "title": "Get list of all posts",    "name": "GetPosts",    "group": "Posts",    "parameter": {      "fields": {        "Query Parameter": [          {            "group": "Query Parameter",            "type": "Boolean",            "optional": false,            "field": "preview",            "defaultValue": "false",            "description": "<p>If set to true, won't contain content</p>"          },          {            "group": "Query Parameter",            "type": "Number",            "optional": false,            "field": "limit",            "defaultValue": "0",            "description": "<p>How many posts should be shown (0 means all of them)</p>"          },          {            "group": "Query Parameter",            "type": "Number",            "optional": false,            "field": "offset",            "defaultValue": "0",            "description": "<p>How many posts should be skipped</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          },          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "data",            "description": "<p>Array of posts</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.title",            "description": "<p>Title of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.previewText",            "description": "<p>Preview text of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.author",            "description": "<p>Author of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.content",            "description": "<p>Content of post, only if preview is set to false</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.thumbnail",            "description": "<p>Thumbail of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.friendlyUrl",            "description": "<p>Friendly url of post</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.created",            "description": "<p>Date of creation of post</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/posts.js",    "groupTitle": "Posts",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/posts/count",    "title": "Get count of all posts",    "name": "GetPostsCount",    "group": "Posts",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          },          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "data",            "description": ""          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.count",            "description": "<p>Count of posts</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/posts.js",    "groupTitle": "Posts",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "post",    "url": "/socials",    "title": "Create new social link",    "name": "CreateSocialLink",    "group": "SocialLinks",    "success": {      "fields": {        "Success 201": [          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          },          {            "group": "Success 201",            "type": "Object",            "optional": false,            "field": "data",            "description": ""          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.name",            "description": "<p>Name of social link</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.url",            "description": "<p>Url of social link</p>"          },          {            "group": "Success 201",            "type": "String",            "optional": false,            "field": "data.icon",            "description": "<p>Icon for social link</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/socials.js",    "groupTitle": "SocialLinks",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "type": "get",    "url": "/socials",    "title": "Get list of social links",    "name": "GetSocialLinks",    "group": "SocialLinks",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "message",            "description": "<p>Success message</p>"          },          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "data",            "description": "<p>Array of social links</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.name",            "description": "<p>Name of social link</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.url",            "description": "<p>Url of social link</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "data.icon",            "description": "<p>Icon for social link</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "./routes/socials.js",    "groupTitle": "SocialLinks",    "error": {      "fields": {        "Error 4xx/5xx": [          {            "group": "Error 4xx/5xx",            "type": "Object",            "optional": false,            "field": "error",            "description": ""          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.name",            "description": "<p>Error name</p>"          },          {            "group": "Error 4xx/5xx",            "type": "String",            "optional": false,            "field": "error.message",            "description": "<p>Error detailed message</p>"          }        ]      }    }  },  {    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "optional": false,            "field": "varname1",            "description": "<p>No type.</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "varname2",            "description": "<p>With type.</p>"          }        ]      }    },    "type": "",    "url": "",    "version": "0.0.0",    "filename": "./docs/main.js",    "group": "_Users_sebastianszczepanski_Desktop_blog_api_sCMS_API_docs_main_js",    "groupTitle": "_Users_sebastianszczepanski_Desktop_blog_api_sCMS_API_docs_main_js",    "name": ""  }] });
