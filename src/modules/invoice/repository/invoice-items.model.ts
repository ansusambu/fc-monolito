import {
  Table,
  Model,
  PrimaryKey,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
  tableName: "invoice_items",
  timestamps: false,
})
export default class InvoiceItemsModel extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false, type: DataType.DECIMAL(10, 2) })
  price: number;

  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false, field: "invoice_id", type: DataType.STRING })
  invoiceId: string;

  @BelongsTo(() => InvoiceModel)
  invoice: InvoiceModel;
}