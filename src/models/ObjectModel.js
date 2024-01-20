class ObjectModel {
    constructor(ObjectID, Name, CategoryID, ImageUri, AudioUri, ParentObjectID = null) {
        this.ObjectID = ObjectID;
        this.Name = Name;
        this.CategoryID = CategoryID;
        this.ImageUri = ImageUri;
        this.AudioUri = AudioUri;
        this.ParentObjectID = ParentObjectID; // Nullable, references ObjectID
    }
}

export default ObjectModel;
