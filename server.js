// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Notes (DATA)
// ============================================================

class Note {
    constructor(id, title, text) {
        this.id = id;
        this.title = title;
        this.text = text;
    }
};

// Routes
// =============================================================

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    fs.readFile(__dirname + "/db/db.json", function(err, data) {
        if (err) throw err;
        return res.json(JSON.parse(data));
        }
    );
});

app.post("/api/notes", function(req, res) {
    fs.readFile(__dirname + "/db/db.json", function(err, data) {
        if (err) throw err;
        let fetchNotes = JSON.parse(data);
        let newNote = req.body;
        fetchNotes.push(newNote);
        updatedNotes = JSON.stringify(fetchNotes, null, '\t')
        fs.writeFile(__dirname + "/db/db.json", updatedNotes, function(err, data) {
            if (err) throw err;
            res.send("written to file");
        });
        }
    );
    
});


// STILL FIGURING THIS OUT
app.get("/api/notes/:id", function(req, res) {
    fs.readFile(__dirname + "/db/db.json", function(err, data) {
        if (err) throw err;
        let fetchNotes = JSON.parse(data);
        var specific = req.params.id;

        for (var i = 0; i < fetchNotes.length; i++) {
            if (specific === fetchNotes[i].id) {
                return res.json(fetchNotes[i]);
            }
        }
    })
});

app.delete("/api/notes/:id", function(req, res) {
    fs.readFile(__dirname + "/db/db.json", function(err, data) {
        if (err) throw err;
        let fetchNotes = JSON.parse(data);
        let specific = req.params.id;

        for (var i = 0; i < fetchNotes.length; i++) {
            console.log(fetchNotes[i].id);
            if (specific === fetchNotes[i].id) {
                fetchNotes.splice(i, 1);
            }
        }

        updatedNotes = JSON.stringify(fetchNotes, null, '\t')
        fs.writeFile(__dirname + "/db/db.json", updatedNotes, function(err, data) {
            if (err) throw err;
            res.send("written to file");
        });
        }
    );
});


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});