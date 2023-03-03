import { ObjectId } from "mongodb";
export default interface Product {
  _id?: ObjectId;
  name: string;
  price: number;
  photoURL?: string;
}
