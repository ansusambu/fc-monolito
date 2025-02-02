import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import InvoiceItemsModel from "../repository/invoice-items.model";
import InvoiceModel from "../repository/invoice.model";

describe("Invoice Facade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
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
    const facade = InvoiceFacadeFactory.create();
  
    const input = {
      id: "2",
      name: "invoice",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };
  
    await facade.generate(input);
  
    const invoice = await InvoiceModel.findOne({
      where: { id: "2" },
      include: [InvoiceItemsModel],
    });
  
    expect(invoice).toBeDefined();
    expect(invoice.id).toBe(input.id);
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.street).toBe(input.street);
    expect(invoice.number).toBe(input.number);
    expect(invoice.complement).toBe(input.complement);
    expect(invoice.city).toBe(input.city);
    expect(invoice.state).toBe(input.state);
    expect(invoice.zipCode).toBe(input.zipCode);
  
    expect(invoice.items).toHaveLength(2);
    expect(invoice.items[0].id).toBe(input.items[0].id);
    expect(invoice.items[0].name).toBe(input.items[0].name);
    expect(invoice.items[0].price).toBe(input.items[0].price);
    expect(invoice.items[1].id).toBe(input.items[1].id);
    expect(invoice.items[1].name).toBe(input.items[1].name);
    expect(invoice.items[1].price).toBe(input.items[1].price);
  });

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      id: "2",
      name: "invoice",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    await facade.generate(input);

    const foundInvoice = await facade.find({ id: "2" });

    expect(foundInvoice).toBeDefined();
    expect(foundInvoice.id).toBe(input.id);
    expect(foundInvoice.name).toBe(input.name);
    expect(foundInvoice.document).toBe(input.document);
    expect(foundInvoice.address.street).toBe(input.street);
    expect(foundInvoice.address.number).toBe(input.number);
    expect(foundInvoice.address.complement).toBe(input.complement);
    expect(foundInvoice.address.city).toBe(input.city);
    expect(foundInvoice.address.state).toBe(input.state);
    expect(foundInvoice.address.zipCode).toBe(input.zipCode);

    expect(foundInvoice.items).toHaveLength(2);
    expect(foundInvoice.items[0].name).toBe(input.items[0].name);
    expect(foundInvoice.items[0].price).toBe(input.items[0].price);
    expect(foundInvoice.items[1].name).toBe(input.items[1].name);
    expect(foundInvoice.items[1].price).toBe(input.items[1].price);
  });
});