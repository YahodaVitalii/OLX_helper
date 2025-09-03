import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as hashUtils from '../../utils/hashPassword';
import * as compareUtils from '../../utils/comparePassword';

describe('UsersService', () => {
  let service: UsersService;
  let repo: UsersRepository;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    username: 'testuser',
    password: 'hashed',
    phoneNumber: '+1234567890',
    city: 'New York',
    name: 'John Doe',
  };

  const mockRepo = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findByEmail: jest.fn().mockResolvedValue(mockUser),
    findByUsername: jest.fn().mockResolvedValue(mockUser),
    findById: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    updatePassword: jest.fn().mockResolvedValue(mockUser),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<UsersRepository>(UsersRepository);
  });

  it('should create a user with hashed password', async () => {
    jest.spyOn(hashUtils, 'hashPassword').mockResolvedValue('hashed');

    const spyCreate = jest.spyOn(repo, 'create').mockResolvedValue(mockUser);

    const dto: CreateUserDto = {
      email: 'test@test.com',
      username: 'testuser',
      password: 'pass123',
      name: 'John Doe',
      phoneNumber: '+1234567890',
      city: 'New York',
    };

    await expect(service.createUser(dto)).resolves.toEqual(mockUser);
    expect(spyCreate).toHaveBeenCalled();
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = { username: 'updated' };
    await expect(service.updateUser(1, dto)).resolves.toEqual(mockUser);
  });

  it('should update password', async () => {
    jest.spyOn(hashUtils, 'hashPassword').mockResolvedValue('newHashed');
    jest.spyOn(compareUtils, 'comparePassword').mockResolvedValue(true);
    const dto: UpdatePasswordDto = { oldPassword: 'old', newPassword: 'new' };
    await expect(service.updatePassword(1, dto)).resolves.toEqual(mockUser);
  });

  it('should throw UnauthorizedException if old password is wrong', async () => {
    jest.spyOn(compareUtils, 'comparePassword').mockResolvedValue(false);
    const dto: UpdatePasswordDto = { oldPassword: 'wrong', newPassword: 'new' };
    await expect(service.updatePassword(1, dto)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should get user by ID', async () => {
    const expected = {
      id: 1,
      email: 'test@test.com',
      username: 'testuser',
      name: 'John Doe',
      phoneNumber: '+1234567890',
      city: 'New York',
      password: undefined,
    };

    await expect(service.getUserById(1)).resolves.toEqual(expected);
  });

  it('should return null if user is not found', async () => {
    const spyFindById = jest.spyOn(repo, 'findById').mockResolvedValue(null);

    await expect(service.getUserById(999)).resolves.toBeNull();
    expect(spyFindById).toHaveBeenCalledWith(999);
  });

  it('should delete a user', async () => {
    await expect(service.deleteUser(1)).resolves.toBeUndefined();
  });
});
