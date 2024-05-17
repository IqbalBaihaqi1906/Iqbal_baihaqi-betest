const UserServices = require('../services/user');
const redis = require('../connection/redis')
const jwt = require('jsonwebtoken');

const User = require('../models/User');

jest.mock('../models/User');
jest.mock('../connection/redis', () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  quit: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}))

describe('User Service', () => {

  describe('Create User', () => {
    it('should create a new user', async () => {
      const userData = {
        userName: 'fakeuser',
        emailAddress: 'fake@gmail.com',
        accountNumber: '1101010',
        identityNumber: '344413'
      };

      const mockUser = { ...userData, id: '1' };
      User.mockImplementation(() => {
        return {
          save: jest.fn().mockResolvedValue(mockUser),
        };
      });

      const user = await UserServices.createUser(userData);

      expect(User).toHaveBeenCalled();
      expect(user).toEqual(mockUser._id);
    });
  });

  describe('isDuplicate', () => {
    it('should not find any duplicate user', async () => {
      const userData = {
        userName: 'fakeuser',
        emailAddress: 'fake@gmail.com',
        accountNumber: '1101010',
        identityNumber: '344413'
      };

      User.findOne.mockResolvedValue(null);
      const isUserDuplicate = UserServices.isDuplicate(userData)
      await expect(isUserDuplicate).resolves.not.toThrow();
    });

    it('should find a duplicate user', async () => {
      const userData = {
        userName: 'fakeuser',
        emailAddress: 'fake@gmail.com',
        accountNumber: '1101010',
        identityNumber: '344413'
      };

      const mockUser = { ...userData, _id: '1' };
      User.findOne.mockResolvedValue(mockUser);

      const isUserDuplicate = UserServices.isDuplicate(userData)
      await expect(isUserDuplicate).rejects.toThrow(`Duplicate data found: userName, emailAddress, accountNumber, identityNumber already exists`);
    });
  });

  describe('Find One By Id', () => {
    const mockUser = {
      _id: '1',
      userName: 'fakeuser',
      emailAddress: 'fake@gmail.com',
      accountNumber: '1101010',
      identityNumber: '344413'
    };
    it('should find a user by id in cache', async () => {
      redis.get.mockResolvedValue(JSON.stringify(mockUser));
      const user = await UserServices.findOneById('1');

      expect(user).toEqual(mockUser);
    })

    it('should find a user by id in database', async () => {
      redis.get.mockResolvedValue(null);
      User.findById.mockResolvedValue(mockUser);

      const user = await UserServices.findOneById('1');
      expect(User.findById).toHaveBeenCalledWith('1');
      expect(redis.set).toHaveBeenCalledWith(`user-id:1`, JSON.stringify(mockUser), 'EX', 3600);
      expect(user).toEqual(mockUser);
    })

    it('should not find a user by id', async () => {
      redis.get.mockResolvedValue(null);
      User.findById.mockResolvedValue(null);

      await expect(UserServices.findOneById('1')).rejects.toThrow("User not found!");
    });
  })

  describe('Delete one user by id', () => {
    const mockUser = {
      _id: '1',
      userName: 'fakeuser',
    }

    it('should delete a user by id if found', async () => {
      User.findByIdAndDelete.mockResolvedValue(mockUser);

      const userId = await UserServices.deleteOne('1');
      expect(User.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(redis.del).toHaveBeenCalledWith(`user-id:1`);
      expect(userId).toEqual(mockUser._id);
    })

    it('should not delete a user by id if not found', async () => {
      User.findByIdAndDelete.mockResolvedValue(null);

      await expect(UserServices.deleteOne('1')).rejects.toThrow("User not found!");
    })
  })

  describe('Update one user by id', () => {
    const mockId = 'someId';
    const mockUserData = {
      userName: 'fakeuser',
      emailAddress: 'fake@gmail.com',
    }

    it('should update a user by id if found', async () => {
      User.findByIdAndUpdate.mockResolvedValue({ _id: mockId, ...mockUserData });
      UserServices.clearCache = jest.fn();

      const user = await UserServices.updateOne(mockId, mockUserData);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(mockId, mockUserData);
      expect(UserServices.clearCache).toHaveBeenCalledWith(mockId);
      expect(user).toEqual(mockId);
    })

    it('should not update a user by id if not found', async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);

      await expect(UserServices.updateOne(mockId, mockUserData)).rejects.toThrow("User not found!");
    })
  })

  describe('Clear Cache', () => {
    it('should clear user cache with id parameter', async () => {
      const mockId = 'someId';
      redis.del.mockResolvedValue(1);
      await UserServices.clearCache(mockId);
      expect(redis.del).toHaveBeenCalledTimes(3);
    });

    it('should clear users cache without id parameter', async () => {
      redis.del.mockResolvedValue(1);
      await UserServices.clearCache();
      expect(redis.del).toHaveBeenCalledWith('users');
    });
  });

  describe('Generate Token', () => {
    it('Should Generate Token', async () => {
      const mockToken = 'mockToken';
      jwt.sign.mockReturnValue(mockToken);

      const token = await UserServices.generateToken();

      expect(jwt.sign).toHaveBeenCalledWith({ isValidUser: true }, process.env.JWT_SECRET);
      expect(token).toBe(mockToken);
    })
  })

  describe('Find one user by identity number', () => {
    const mockUser = {
      _id: '1',
      userName: 'fakeuser',
      emailAddress: 'fake@gmail.com',
      accountNumber: '1101010',
      identityNumber: '344413'
    };

    it('should find a user by identity number', async() => {
      User.findOne.mockResolvedValue(mockUser);

      const user = await UserServices.findByIdentityNumber('344413');
      expect(User.findOne).toHaveBeenCalledWith({ identityNumber: '344413' });
      expect(user).toBe(mockUser);
    })
  })

  describe('Find one user by account number', () => {
    const mockUser = {
      _id: '1',
      userName: 'fakeuser',
      emailAddress: 'fake@gmail.com',
      accountNumber: '1101010',
      identityNumber: '344413'
    };

    it('should find a user by account number', async() => {
      User.findOne.mockResolvedValue(mockUser);

      const user = await UserServices.findByAccountNumber('1101010');
      expect(User.findOne).toHaveBeenCalledWith({ accountNumber: '1101010' });
      expect(user).toBe(mockUser);
    })
  })

  afterAll(() => {
    redis.quit();
  })
})