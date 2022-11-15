# INFSCI 2560 Assignment 3B

## Error Handle

Proper error handling and response code when a request doesn't conform to the API.

### Database

I add a error hanling function for connection to MongoDB. In real world, error could happened before connection established or during operating. So for different senario, I create different error handle function.

```javascript
// Error handling for initialize
mongoose
	.connect(mongoDB, {
		useNewUrlParser: true,
		retryWrites: true,
	})
	.catch((error) => {
		console.error({
			mssg: "Database connect failed",
			info: error,
		});
	});
```

```javascript
// Activate server after establish connection
mongoose.connection.once("open", () => {
	app.emit("dbReady");
});
```

```javascript
// Error handling for error after initial
mongoose.connection.on("error", (error) => {
	app.emit("dbFailed");
	console.error({
		mssg: "Database connect failed",
		info: error,
	});
});
```

The mongoose will emit signal or command to indicate the status of connecting. Server only operate when mongoose said:"okay, I connected to db".

```javascript
app.on("dbReady", function () {
	const listener = app.listen(process.env.PORT, function () {
		console.log("Your app is listening on port " + listener.address().port);
	});
});
```

---

**Following are based on assignment 3a**

### Express.json

```javascript
app.use(express.json());
```

By stating`app.use(express.json())` , it enable us access to `request.body` while at the same time helping us handle errors.

This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.

Returns middleware that only parses JSON and only looks at requests where the `Content-Type` header matches the `type` option. This parser accepts any Unicode encoding of the body and supports automatic inflation of `gzip` and `deflate` encodings.

A new `body` object containing the parsed data is populated on the `request` object after the middleware (i.e. `req.body`), or an empty object (`{}`) if there was no body to parse, the `Content-Type` was not matched, or an error occurred.

Or we can also specify it as

```javascript
app.post('/applicationJson', bodyParser.json(), function (req, res) {
	...
  res.send(result);
});
```

### statusHandler

```javascript
function statusHandler(req, res, statusCode, data) {
	let responseBody = {
		statusCode: statusCode,
		mssg: "Unconfirmed",
		data: data ? data : [],
	};
	switch (statusCode) {
		case 200:
			responseBody.mssg = "Great, successfully handled";
			break;
		case 201:
			responseBody.mssg = "Great, successfully created";
			break;
		case 400:
			responseBody.mssg =
				"Bad request, server cannot process, please check query body";
			break;
		case 404:
			responseBody.mssg = "Not found, request item doesnt exist";
			break;
		case 500:
			responseBody.mssg = "Internal Server error";
			break;
	}

	res.json(responseBody);
	res.end();
}
```

---

## API Document

Retrieve all resources

```javascript
End Point: GET /letterbox
Parameters: NA
Payloads: NA
Response: {
    "statusCode": 200,
    "mssg": "Great, successfully handled",
    "data": [
        {
            "movies": [
                {
                    "detail": {
                        "year": 2022,
                        "desc": "too real to be published"
                    },
                    "_id": "636af575ed1b9d96f156cc27",
                    "name": "Epic of 3rd Semester",
                    "director": "IS Internation Student",
                    "genres": [
                        "documentary",
                        "real",
                        "based on true story"
                    ],
                    "rating": 0,
                    "__v": 0
                },
                {
                    "detail": {
                        "year": 2022,
                        "desc": "too real to be published"
                    },
                    "_id": "63730a7e3f5cab617a1e57b5",
                    "name": "The journey of looking for a fk job",
                    "director": "Drake Zhou",
                    "genres": [
                        "documentary",
                        "real",
                        "based on true story"
                    ],
                    "rating": 10,
                    "__v": 0
                },
                {
                    "detail": {
                        "year": 2014,
                        "desc": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
                    },
                    "_id": "6373f8cacf6da6a9ffae73b6",
                    "name": "Interstellar",
                    "director": "Christopher Nolan",
                    "genres": [
                        "adventure",
                        "Drama",
                        "Sci-Fi"
                    ],
                    "rating": 8.6,
                    "__v": 0
                },
                {
                    "detail": {
                        "year": 1999,
                        "desc": "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more."
                    },
                    "_id": "6373f8cacf6da6a9ffae73b5",
                    "name": "Fight Club",
                    "director": "David Fincher",
                    "genres": [
                        "drama"
                    ],
                    "rating": 8.8,
                    "__v": 0
                },
                {
                    "detail": {
                        "year": 1999,
                        "desc": "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more."
                    },
                    "_id": "6373f95d0aba502d7b5fb634",
                    "name": "Fight Club",
                    "director": "David Fincher",
                    "genres": [
                        "drama"
                    ],
                    "rating": 8.8,
                    "__v": 0
                },
                {
                    "detail": {
                        "year": 2014,
                        "desc": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
                    },
                    "_id": "6373f95d0aba502d7b5fb635",
                    "name": "Interstellar",
                    "director": "Christopher Nolan",
                    "genres": [
                        "adventure",
                        "Drama",
                        "Sci-Fi"
                    ],
                    "rating": 8.6,
                    "__v": 0
                }
            ]
        },
        {
            "directors": [
                {
                    "_id": "6373d567fa56165135676551",
                    "name": "Drake Zhou",
                    "age": 24,
                    "country": "China",
                    "generation": 95,
                    "style": [
                        "sarcastic",
                        "real"
                    ],
                    "__v": 0
                },
                {
                    "_id": "6373d6bc304db4ff9c5b5b92",
                    "name": "Yifei Tai",
                    "age": 25,
                    "country": "China",
                    "generation": 95,
                    "style": [
                        "sarcastic",
                        "real"
                    ],
                    "__v": 0
                }
            ]
        }
    ]
}
```

### Excceptional operation

Bulk create / insert movies

```javascript
End Point: PATCH /letterbox/movies/bulkcreate
Parameters: NA
Payloads: [
    {
        "name": "Fight Club",
        "director": "David Fincher",
        "genres": [
            "drama"
        ],
        "rating": 8.8,
        "detail": {
            "year": 1999,
            "desc": "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more."
        }
    },
    {
        "name": "Interstellar",
        "director": "Christopher Nolan",
        "genres": ["adventure","Drama","Sci-Fi"],
        "rating": 8.6,
        "detail": {
            "year": 2014,
            "desc": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
        }
    }
]
Response: {
    "statusCode": 200,
    "mssg": "Great, successfully handled",
    "data": [
        {
            "name": "Fight Club",
            "director": "David Fincher",
            "genres": [
                "drama"
            ],
            "rating": 8.8,
            "detail": {
                "year": 1999,
                "desc": "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more."
            }
        },
        {
            "name": "Interstellar",
            "director": "Christopher Nolan",
            "genres": [
                "adventure",
                "Drama",
                "Sci-Fi"
            ],
            "rating": 8.6,
            "detail": {
                "year": 2014,
                "desc": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
            }
        }
    ]
}
```

Get the sub-collection(of movie) by ID

```javascript
End Point: GET /letterbox/movies/:id/detail
Parameter: id
Payload: NA
Response Code:
{
    "statusCode": 200,
    "mssg": "Great, successfully handled",
    "data": {
        "year": 2022,
        "desc": "too real to be published"
    }
}
```

### Movies

Get all movies

```javascript
End Point: GET /movies
Parameters: NA
Payloads: NA
Response codes:

{
"statusCode": 200,
"mssg": "Great, successfully handled",
"data": [
{
"\_id": "636af575ed1b9d96f156cc27",
"name": "Epic of 3rd Semester",
"director": "IS Internation Student",
"genres": [
"documentary",
"real",
"based on true story"
],
"rating": 0,
"**v": 0
},
{
"\_id": "636af5a0ed1b9d96f156cc2b",
"name": "The journey of looking for a fk job",
"director": "Drake Zhou",
"genres": [
"documentary",
"real",
"based on true story"
],
"rating": 10,
"**v": 0
}
]
}
```

Get a movie by ID

```javascript
End Point: GET /movies/:id
Parameter: id,
Payload: NA,
Response Codes:
{
    "statusCode": 403,
    "mssg": "Unconfirmed",
    "data": {
        "stringValue": "\"636af575ed1b9d96f156cc2\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "636af575ed1b9d96f156cc2",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"636af575ed1b9d96f156cc2\" (type string) at path \"_id\" for model \"Movies\""
    }
}

OR

{
    "statusCode": 200,
    "mssg": "Great, successfully handled",
    "data": {
        "_id": "636af575ed1b9d96f156cc27",
        "name": "Epic of 3rd Semester",
        "director": "IS Internation Student",
        "genres": [
            "documentary",
            "real",
            "based on true story"
        ],
        "rating": 0,
        "__v": 0
    }
}
```

Update a movie by ID

```javascript
End Point: POST .../movies/:id
Parameter: id,
Payload:
{
    "detail": {
        "year": 2022,
        "desc": "too real to be published"
    }
}
Response:
{
    "statusCode": 200,
    "mssg": "Great, successfully handled",
    "data": {
        "_id": "636af575ed1b9d96f156cc27",
        "name": "Epic of 3rd Semester",
        "director": "IS Internation Student",
        "genres": [
            "documentary",
            "real",
            "based on true story"
        ],
        "rating": 0,
        "__v": 0
    }
}

OR

{
    "statusCode": 404,
    "mssg": "Not found, request item doesnt exist",
    "data": {
        "stringValue": "\"636af575ed1b9d96f156cc2\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "636af575ed1b9d96f156cc2",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"636af575ed1b9d96f156cc2\" (type string) at path \"_id\" for model \"Movies\""
    }
}
```

Delete a movie by ID

```javascript
End Point: DELETE /letterbox/movies/:id
Parameters: id
Payload: NA
Response Code:
{
    "statusCode": 404,
    "mssg": "Not found, request item doesnt exist",
    "data": {
        "stringValue": "\"636af5a0ed1b9d96f156cc2\"",
        "valueType": "string",
        "kind": "ObjectId",
        "value": "636af5a0ed1b9d96f156cc2",
        "path": "_id",
        "reason": {},
        "name": "CastError",
        "message": "Cast to ObjectId failed for value \"636af5a0ed1b9d96f156cc2\" (type string) at path \"_id\" for model \"Movies\""
    }
}

OR

{
    "statusCode": 200,
    "mssg": "Great, successfully handled",
    "data": {
        "_id": "636af5a0ed1b9d96f156cc2b",
        "name": "The journey of looking for a fk job",
        "director": "Drake Zhou",
        "genres": [
            "documentary",
            "real",
            "based on true story"
        ],
        "rating": 10,
        "__v": 0
    }
}
```

Create a movie

```javascript
End Point: PUT /letterbox/movies
Parameter: NA
Payload:
{
    "name": "The journey of looking for a fk job",
    "director": "Drake Zhou",
    "genres": [
        "documentary",
        "real",
        "based on true story"
    ],
    "rating": 10,
    "detail": {
        "year": 2022,
        "desc": "too real to be published"
    }
}
Response Code:
{
    "statusCode": 200,
    "mssg": "Great, successfully handled",
    "data": {
        "name": "The journey of looking for a fk job",
        "director": "Drake Zhou",
        "genres": [
            "documentary",
            "real",
            "based on true story"
        ],
        "rating": 10,
        "detail": {
            "year": 2022,
            "desc": "too real to be published"
        },
        "_id": "63730a7e3f5cab617a1e57b5",
        "__v": 0
    }
}
```

### Directors

Create a director

```javascript
End Point: PUT /letterbox/directors
Parameter: NA
Payload: {
    "name": "Christopher Nolan",
    "age": 52,
    "country": "USA",
    "generation": 85,
    "style": ["sarcastic", "real", "drama", "adventure"]
}
Response: {
    "statusCode": 200,
    "mssg": "Great, successfully handled",
    "data": {
        "name": "Christopher Nolan",
        "age": 52,
        "country": "USA",
        "generation": 85,
        "style": [
            "sarcastic",
            "real",
            "drama",
            "adventure"
        ],
        "_id": "6373fd70aee4fece24f994db",
        "__v": 0
    }
}
```

Get all directors data

```javascript
Endpoint: GET /letterbox/directors
Parameter: NA
Payload: NA
Response:
```

Get a director data by ID

```javascript
Endpoint: GET /letterbox/director/:id
Parameter: ID = 6373d567fa56165135676551
Payload: NA
Response: {
    "statusCode": 200,
    "mssg": "Great, successfully handled",
    "data": {
        "_id": "6373d567fa56165135676551",
        "name": "Drake Zhou",
        "age": 24,
        "country": "China",
        "generation": 95,
        "style": [
            "sarcastic",
            "real"
        ],
        "__v": 0
    }
}
```

Delete a director data by ID

```javascript
Endpoint: DELETE /letterbox/director/:id
Parameter: ID = 6373d6bc304db4ff9c5b5b92
Payload: NA
Response: {
    "statusCode": 200,
    "mssg": "Great, successfully handled",
    "data": {
        "_id": "6373d6bc304db4ff9c5b5b92",
        "name": "Yifei Tai",
        "age": 25,
        "country": "China",
        "generation": 95,
        "style": [
            "sarcastic",
            "real"
        ],
        "__v": 0
    }
}
```

Update a director by ID

```javascript
EndPoint: POST /letterbox/director/:id
Parameter: id = 637401cfaee4fece24f994e1
Payload: {
    "style": ["documentary", "drama", "real"]
}
Response: {
    "statusCode": 200,
    "mssg": "Great, successfully handled",
    "data": {
        "_id": "637401cfaee4fece24f994e1",
        "name": "Robert Zemeckis",
        "age": 80,
        "country": "USA",
        "generation": 71,
        "style": [
            "Producer",
            "Writer",
            "Director"
        ],
        "__v": 0
    }
}
```
