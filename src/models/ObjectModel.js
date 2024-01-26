class ObjectModel {
    constructor(id, name, categoryId, imageUri, audioUri, parentObjectID) {
        this.id = id;
        this.Name = name;
        this.CategoryID = categoryId;
        this.ImageUri = imageUri;
        this.AudioUri = audioUri;
        this.ParentObjectID = parentObjectID;
    }
}

export default ObjectModel;
