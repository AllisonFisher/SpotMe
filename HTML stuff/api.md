# API

## Endpoints
### `GET` `/api/areas/`
#### Description
Returns an array of all of the areas in their current state. Every area must have every field described in the sample response.
#### Sample request
`/api/areas`
#### Sample response
```
[
    {
        "id": 1235,
        "chairs": 5,
        "comfy_chairs": 0,
        "tables": 3,
        "whiteboard_tables": 0,
        "whiteboards": 1,
        "outlets": 42,
        "floor": 6,
        "quiet": true,
        "name": "By the elevator",
        "last_updated": 1428540550495,
        "curr_occupancy": 2,
        "curr_whiteboards_used": 0,
        "curr_tables_used": 1
    }, ...
]
```

### `POST` `/api/areas/:id/`
#### Description
This is an update to the database. It receives a subset of the fields of an area. It ignores the read-only fields and updates all other fields to the values given in the payload. It returns the updated area with the given id.
#### Sample request
`/api/areas/1235/`
#### Sample request payload
```
{
    "curr_occupancy": 4
}
```
#### Sample response
```
{
    "id": 1235,
    "chairs": 5,
    "comfy_chairs": 0,
    "tables": 3,
    "whiteboard_tables": 0,
    "whiteboards": 1,
    "outlets": 42,
    "floor": 6,
    "quiet": true,
    "name": "By the elevator",
    "last_updated": 1428540550495,
    "curr_occupancy": 4,
    "curr_whiteboards_used": 0,
    "curr_tables_used": 1
}
```
