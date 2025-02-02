import Id from "./id.value-object";
import ValueObject from "./value-object.interface";

export default class InvoiceItems implements ValueObject {
  private _id?: Id;
  private _name: string;
  private _price: number;

  constructor(name: string, price: number, id?: Id) {
    this._name = name;
    this._price = price;
    this._id = id;
  }

  get id(): Id {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }
}