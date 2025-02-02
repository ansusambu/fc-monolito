import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceItems from "../../../@shared/domain/value-object/invoice-items.value-object"
import Invoice from "../../domain/invoice.entity"
import FindInvoiceUseCase from "./find-invoice.usecase";

const mockInvoice = new Invoice({
  id: new Id("1"),
  name: "Test Invoice",
  document: "123456789",
  address: new Address(
      "Rua 123",
      "99",
      "Casa Verde",
      "Criciúma",
      "SC",
      "88888-888",
    ),
  items: [
    new InvoiceItems(
      "Item 1",
      100,
      new Id("1"),
    ),
    new InvoiceItems(
      "Item 2",
      200,
      new Id("2"),
    )
  ],
  createdAt: new Date(),
  updatedAt: new Date()
});

const MockRepository = () => {

  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(mockInvoice))
  }
}

describe("Find invoice use case unit test", () => {
  it("should find an invoice", async () => {

    const repository = MockRepository()
    const usecase = new FindInvoiceUseCase(repository)

    const input = {
      id: "1"
    }

    const result = await usecase.execute(input)

    expect(repository.find).toHaveBeenCalled()
    expect(result.id).toEqual(input.id)
  })
})