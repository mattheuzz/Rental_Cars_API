import { AppError } from "@errors/error"
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsInMemory"
import { SpecificationRepoasitoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationRepoasitoryInMemory";
import { SpecificationRepository } from "@modules/cars/repositories/Specification";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecification"


let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory
let specificationRepository: SpecificationRepoasitoryInMemory
describe('Create Car Specification', () => {
  beforeEach(() => {
    specificationRepository = new SpecificationRepoasitoryInMemory()
    carsRepositoryInMemory = new CarsRepositoryInMemory()
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationRepository as unknown as SpecificationRepository
    )
  })

  test('Should be able to create a new car specification to a non-existent car', async () => {
    expect(async () => {
      const car_id = '12345'
      const specification_id = ['6789']
      await createCarSpecificationUseCase.execute({
        car_id,
        specification_id
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  test('Should not be able to create a new car specification to the car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Fusca',
      description: 'Fusca é um carro de luxo',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 10,
      brand: 'VW',
      category_id: '12345'
    })
    const specification = await specificationRepository.create({
      name: '4 portas',
      description: 'Carro com 4 portas',
    })
    await createCarSpecificationUseCase.execute({
      car_id: car.id as string,
      specification_id: [specification.id as string]
    })
  })
})