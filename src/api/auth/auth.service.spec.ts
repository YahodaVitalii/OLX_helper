import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService = {
    getUserByLogin: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if password is correct', async () => {
      const user = {
        id: 1,
        username: 'test',
        password: await bcrypt.hash('pass', 10),
      };
      mockUsersService.getUserByLogin.mockResolvedValue(user);

      const result = await authService.validateUser('test', 'pass');
      expect(result).not.toBeNull();
      expect(result!.username).toEqual('test');
    });

    it('should return null if password is incorrect', async () => {
      const user = {
        id: 1,
        username: 'test',
        password: await bcrypt.hash('pass', 10),
      };
      mockUsersService.getUserByLogin.mockResolvedValue(user);

      const result = await authService.validateUser('test', 'wrong');
      expect(result).toBeNull();
    });

    it('should return null if user does not exist', async () => {
      mockUsersService.getUserByLogin.mockResolvedValue(null);

      const result = await authService.validateUser('notfound', 'pass');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access_token if credentials are valid', async () => {
      const loginDto: LoginUserDto = { username: 'test', password: 'pass' };
      const user = {
        id: 1,
        username: 'test',
        password: await bcrypt.hash('pass', 10),
      };
      mockUsersService.getUserByLogin.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('signed-token');

      const result = await authService.login(loginDto);
      expect(result).toEqual({ access_token: 'signed-token' });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginUserDto = { username: 'test', password: 'wrong' };
      mockUsersService.getUserByLogin.mockResolvedValue({
        id: 1,
        username: 'test',
        password: await bcrypt.hash('pass', 10),
      });

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
