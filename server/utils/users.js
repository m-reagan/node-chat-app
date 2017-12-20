class User {

    constructor () {
        this.users = [];
    };

    addUser (id, name, room) {
        var user = {id,name,room}
        this.users.push(user);
        return user;
    };

    getUser(id) {
        return this.users.filter( (user) => user.id === id)[0];
    };

    removeUser(id) {
        this.users = this.users.filter( (user) => user.id !== id);
    };

    getUserList(room) {
        return this.users.filter((user) => user.room === room).map((user) => user.name);
    };

};

module.exports = User;