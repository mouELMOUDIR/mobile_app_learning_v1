class NoteModel {
    constructor(NoteID, Content, ObjectID = null, CategoryID,title) {
        this.NoteID = NoteID;
        this.Content = Content;
        this.ObjectID = ObjectID;
        this.CategoryID = CategoryID;
        this.title = title;
    }
}

export default NoteModel;