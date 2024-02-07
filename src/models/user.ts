import mongoose from 'mongoose';

// An ts interface that describes the properties
// that are required to create a new User

interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has (collection)
interface UserModel extends mongoose.Model<UserDoc> {
  build(attr: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has (single user)
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String, // this is a JS constructor function
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// typsecript doesnt know about the static build method on the model
// so we use the below to tell typescript about it
// User.build({
//   email: 'test@c.om',
//   password: 'pass',
// });

export { User };
