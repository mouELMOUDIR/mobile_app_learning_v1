// models/UserModel.js
class UserModel {
    constructor(UserID, Username, Email, AccountType) {
        this.UserID = UserID;
        this.Username = Username;
        this.Email = Email;
        this.AccountType = AccountType; // 'free' or 'paid'
    }
}

export default UserModel;