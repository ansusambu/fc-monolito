import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceRepository from "./invoice.repository";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceItems from "../../@shared/domain/value-object/invoice-items.value-object";

describe("Invoice Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Test Invoice",
      document: "123456789",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      items: [
        new InvoiceItems("Item 1", 100, new Id("1")),
        new InvoiceItems("Item 2", 200, new Id("2")),
      ],
    });
  
    const repository = new InvoiceRepository();
    await repository.generate(invoice);
  
    const invoiceDb = await InvoiceModel.findOne({
      where: { id: "1" },
      include: [{ model: InvoiceItemsModel }],
    });
  
    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toEqual(invoice.id.id);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.document).toEqual(invoice.document);
    expect(invoiceDb.street).toEqual(invoice.address.street);
    expect(invoiceDb.number).toEqual(invoice.address.number);
    expect(invoiceDb.complement).toEqual(invoice.address.complement);
    expect(invoiceDb.city).toEqual(invoice.address.city);
    expect(invoiceDb.state).toEqual(invoice.address.state);
    expect(invoiceDb.zipCode).toEqual(invoice.address.zipCode);
    expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt);
    expect(invoiceDb.updatedAt).toStrictEqual(invoice.updatedAt);
  
    expect(invoiceDb.items.length).toBe(2);
    expect(invoiceDb.items[0].name).toBe("Item 1");
    expect(invoiceDb.items[0].price).toBe(100);
    expect(invoiceDb.items[1].name).toBe("Item 2");
    expect(invoiceDb.items[1].price).toBe(200);
  });

  it("should find an invoice", async () => {
    const invoice = await InvoiceModel.create(
      {
        id: "1",
        name: "Test Invoice",
        document: "123456789",
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
        items: [
          { id: "1", name: "Item 1", price: 100, invoiceId: "1" },
          { id: "2", name: "Item 2", price: 200, invoiceId: "1" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        include: [{ model: InvoiceItemsModel }],
      }
    );

    const repository = new InvoiceRepository();
    const result = await repository.find(invoice.id);

    expect(result.id.id).toEqual(invoice.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.street).toEqual(invoice.street);
    expect(result.address.number).toEqual(invoice.number);
    expect(result.address.complement).toEqual(invoice.complement);
    expect(result.address.city).toEqual(invoice.city);
    expect(result.address.state).toEqual(invoice.state);
    expect(result.address.zipCode).toEqual(invoice.zipCode);
    expect(result.createdAt).toStrictEqual(invoice.createdAt);
    expect(result.updatedAt).toStrictEqual(invoice.updatedAt);

    expect(result.items.length).toBe(2);
    expect(result.items[0].name).toBe("Item 1");
    expect(result.items[0].price).toBe(100);
    expect(result.items[1].name).toBe("Item 2");
    expect(result.items[1].price).toBe(200);
  });
});