import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    username: 'testuser',
    name: 'John Doe',
    password: 'hashedPassword',
    phoneNumber: '+1234567890',
    city: 'New York',
  };

  const mockUsersService = {
    createUser: jest.fn().mockResolvedValue(mockUser),
    updateUser: jest.fn().mockResolvedValue(mockUser),
    updatePassword: jest.fn().mockResolvedValue(mockUser),
    getUserById: jest.fn().mockResolvedValue(mockUser),
    deleteUser: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      email: 'test@test.com',
      username: 'testuser',
      password: 'pass123',
      name: 'John Doe',
      phoneNumber: '+1234567890',
      city: 'New York',
    };

    const spyCreateUser = jest
      .spyOn(service, 'createUser')
      .mockResolvedValue(mockUser);

    await expect(controller.create(dto)).resolves.toEqual(mockUser);
    expect(spyCreateUser).toHaveBeenCalledWith(dto);
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = { username: 'updated' };
    await expect(controller.update(1, dto)).resolves.toEqual(mockUser);
  });

  it('should change password', async () => {
    const dto: UpdatePasswordDto = { oldPassword: 'old', newPassword: 'new' };
    await expect(controller.changePassword(1, dto)).resolves.toEqual(mockUser);
  });

  it('should get user by ID', async () => {
    await expect(controller.getUserById(1)).resolves.toEqual(mockUser);
  });

  it('should throw NotFoundException if user not found', async () => {
    jest.spyOn(service, 'getUserById').mockResolvedValueOnce(null);
    await expect(controller.getUserById(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete a user', async () => {
    await expect(controller.deleteUser(1)).resolves.toBeUndefined();
  });
});
