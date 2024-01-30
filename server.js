const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'learning',
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL');
});

//-------------------------------------------------------Category------------------------------------------------------------------//

// Endpoint to get all categories
app.get('/getCategories', (req, res) => {
    const sql = 'SELECT * FROM categories';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(result);
    });
});

// Endpoint to add a new category
app.post('/addCategory', (req, res) => {
    const { name, imageURL } = req.body;

    // Validate that 'name' and 'imageURL' are present
    if (!name || !imageURL) {
        return res.status(400).json({ error: 'Name and imageURL are required' });
    }

    const sql = 'INSERT INTO categories (name, imageURL) VALUES (?, ?)';
    db.query(sql, [name, imageURL], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Category added successfully' });
    });
});


// Endpoint to delete a category
app.delete('/deleteCategory/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    const sql = 'DELETE FROM categories WHERE id = ?';

    db.query(sql, [categoryId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Category deleted successfully' });
    });
});

// Endpoint to get objects by category
app.get('/getObjectsByCategory/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    const sql = 'SELECT * FROM objects WHERE CategoryID = ?';

    db.query(sql, [categoryId], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const objects = await buildObjectHierarchy(result, null);
        res.json(objects);
    });
});

async function buildObjectHierarchy(objects, parentId) {
    const filteredObjects = objects.filter(obj => obj.ParentObjectID === parentId);

    const hierarchy = await Promise.all(filteredObjects.map(async obj => {
        const children = await buildObjectHierarchy(objects, obj.id);
        return { ...obj, Children: children };
    }));

    return hierarchy;
}


// Endpoint to check if a category has associated objects
app.get('/checkCategoryObjects/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    const sql = 'SELECT COUNT(*) AS objectCount FROM objects WHERE CategoryID = ?';

    db.query(sql, [categoryId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const objectCount = result[0].objectCount;
        res.json({ objectCount });
    });
});

// Modified endpoint to delete a category
app.delete('/deleteCategory/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;

    // Check if the category has associated objects
    const objectCount = await new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS objectCount FROM objects WHERE CategoryID = ?';
        db.query(sql, [categoryId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0].objectCount);
            }
        });
    });

    if (objectCount > 0) {
        // Category has associated objects, inform the client
        return res.status(400).json({ error: 'Category has associated objects' });
    }

    // Delete the category from the server
    const deleteSql = 'DELETE FROM categories WHERE id = ?';
    db.query(deleteSql, [categoryId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Category deleted successfully' });
    });
});


//---------------------------------------------------OBJECT------------------------------------------------------------------------//

// Endpoint to add a new object
app.post('/addObject', (req, res) => {
    const { Name, CategoryID, ImageUri, AudioUri, ParentObjectID } = req.body;

    // Validate that required fields are present
    if (!Name || !CategoryID || !ImageUri || !AudioUri) {
        return res.status(400).json({ error: 'Name, CategoryID, ImageUri, and AudioUri are required' });
    }

    const sql = 'INSERT INTO objects (Name, CategoryID, ImageUri, AudioUri, ParentObjectID) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [Name, CategoryID, ImageUri, AudioUri, ParentObjectID], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Object added successfully' });
    });
});

// Endpoint to delete an object
app.delete('/deleteObject/:objectId', (req, res) => {
    const objectId = req.params.objectId;
    const sql = 'DELETE FROM objects WHERE id = ?';

    db.query(sql, [objectId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Object deleted successfully' });
    });
});

// Endpoint to get objects by parent object
app.get('/getObjectsByParentObject/:parentObjectId', (req, res) => {
    const parentObjectId = req.params.parentObjectId;
    const sql = 'SELECT * FROM objects WHERE ParentObjectID = ?';

    db.query(sql, [parentObjectId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(result);
    });
});

// Endpoint to check if a object has associated objects
app.get('/checkObjectObjects/:objectId', (req, res) => {
    const objectId = req.params.objectId;
    const sql = 'SELECT COUNT(*) AS objectCount FROM objects WHERE ParentObjectID = ?';

    db.query(sql, [objectId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const objectCount = result[0].objectCount;
        res.json({ objectCount });
    });
});

// Modified endpoint to delete a object
app.delete('/deleteObject/:objectId', async (req, res) => {
    const objectId = req.params.objectId;

    // Check if the object has associated objects
    const objectCount = await new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS objectCount FROM objects WHERE ParentObjectID = ?';
        db.query(sql, [objectId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0].objectCount);
            }
        });
    });

    if (objectCount > 0) {
        // object has associated objects, inform the client
        return res.status(400).json({ error: 'Object has associated objects' });
    }

    // Delete the object from the server
    const deleteSql = 'DELETE FROM objects WHERE id = ?';
    db.query(deleteSql, [objectId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Object deleted successfully' });
    });
});

//------------------------------------------------------NOTES------------------------------------------------------------------------//

app.get('/getNotesByCategoryID/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    const sql = 'SELECT * FROM notes WHERE CategoryID = ?';

    db.query(sql, [categoryId], (err, result) => {
        if (err) {
            console.error('Error fetching notes by category ID:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send(JSON.stringify(result));
    });
});

app.get('/getNotesByObjectID/:objectId', (req, res) => {
    const objectId = req.params.objectId;
    const sql = 'SELECT * FROM notes WHERE ObjectID = ?';

    db.query(sql, [objectId], (err, result) => {
        if (err) {
            console.error('Error fetching notes by category ID:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send(JSON.stringify(result));
    });
});

app.post('/addNoteForObject', async (req, res) => {
    try {
        const { Content, ObjectID, title } = req.body;

        // Insert the new note into the database with UTF-8 encoding
        const result = await db.query('INSERT INTO Notes (Content, ObjectID, title) VALUES (?, ?, ?)', [Content, ObjectID, title]);

        res.json({ success: true, noteID: result.insertId });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.post('/addNote', async (req, res) => {
    try {
        const { Content, CategoryID, title } = req.body;

        // Insert the new note into the database with UTF-8 encoding
        const result = await db.query('INSERT INTO Notes (Content, CategoryID, title) VALUES (?, ?, ?)', [Content, CategoryID, title]);

        res.json({ success: true, noteID: result.insertId });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.post('/addNoteByObjectOrCategory', async (req, res) => {
    try {
        const { Content, ObjectID, CategoryID, title } = req.body;

        // Insert the new note into the database with UTF-8 encoding
        let result;
        if (ObjectID) {
            result = await db.query('INSERT INTO Notes (Content, ObjectID, title) VALUES (?, ?, ?, ?)', [Content, ObjectID, title]);
        } else {
            result = await db.query('INSERT INTO Notes (Content, CategoryID, title) VALUES (?, ?, ?)', [Content, CategoryID, title]);
        }

        res.json({ success: true, noteID: result.insertId });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


app.put('/updateNote/:noteId', (req, res) => {
    const { noteId } = req.params;
    const { title, Content } = req.body;

    const sql = 'UPDATE notes SET Content = ?, title = ? WHERE NoteID = ?';
    db.query(sql, [Content, title, noteId], (err, result) => {
        if (err) {
            console.error('Error updating note:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ success: true, message: 'Note updated successfully' });
    });
});

app.delete('/deleteNote/:noteId', (req, res) => {
    const { noteId } = req.params;

    const sql = 'DELETE FROM notes WHERE NoteID = ?';

    db.query(sql, [noteId], (err, result) => {
        if (err) {
            console.error('Error deleting note:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ success: true, message: 'Note deleted successfully' });
    });
});

//------------------------------------------------------------------------------------------------------------------------------------//
app.listen(port, () => {
    console.log(`Server running on http://192.168.0.157:${port}`);
});

