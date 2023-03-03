import { ObjectId } from "mongodb";
export default interface User {
  _id?: ObjectId;
  displayName: string;
  photoURL: string;
  darkTheme: string;
}
