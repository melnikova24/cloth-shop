export class UserDTO {
    _id
    name
    email
    role

    constructor(model) {
        this._id = model._id
        this.name = model.name
        this.email = model.email
        this.role = model.role
    }
}