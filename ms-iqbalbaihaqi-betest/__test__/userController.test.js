const { create, findAll, findOne, deleteOne, update, generateToken, findByAccountNumber, findByIdentityNumber } = require('../controllers/userController');
const redis = require('../connection/redis')
const UserService = require('../services/user');

// Mock UserService methods
jest.mock('../services/user', () => ({
  isDuplicate: jest.fn(),
  createUser: jest.fn(),
  findAll: jest.fn(),
  findOneById: jest.fn(),
  deleteOne: jest.fn(),
  updateOne: jest.fn(),
  generateToken: jest.fn(),
  findByAccountNumber: jest.fn(),
  findByIdentityNumber: jest.fn(),
}));

// stub request and response objects
const res = {
  status: jest.fn(() => res),
  json: jest.fn()
}

const next = jest.fn();

describe('User Controller', () => {

  describe('Create User API', () => {
    const req = {
      body: {
        userName: 'fakeuser',
        emailAddress: 'fake@gmail.com',
        accountNumber: '1101010',
        identityNumber: '344413'
      }
    }

    it('should return success true and message user created', async () => {
      UserService.isDuplicate.mockResolvedValue(false);
      UserService.createUser.mockResolvedValue(req.body);
      await create(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User created',
        data: req.body
      });
    });

    it('should handle errors', async () => {
      const errorMessage = { message: 'Error message' };
      UserService.createUser.mockRejectedValue(errorMessage);
      await create(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it('should handle duplicate user data', async () => {
      const errorMessage = { message: 'Duplicate data found', code: 400 };
      UserService.isDuplicate.mockImplementation(() => {
        throw errorMessage;
      });
      await create(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('Find All Users API', () => {
    it('should return success with users data and status code 200', async () => {
      const users = [
        {
          userName: 'fakeuser1',
          emailAddress: 'fake1@email.com',
        },
        {
          userName: 'fakeuser2',
          emailAddress: 'fake2@email.com',
        }
      ]

      UserService.findAll.mockResolvedValue(users);
      await findAll({}, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Users Found",
        data: users
      });
    });

    it('should throw an error with status code 404 when no users are found', async () => {
      UserService.findAll.mockResolvedValue([]);
      await findAll({}, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }));
    });
  });

  describe('Find One User API', () => {
    const req = {
      params: { id: 'fakeid' }
    }
    it('should return success with user data and status code 200', async () => {
      const user = {
        userName: 'fakeuser1',
        emailAddress: 'fake@gmail.com1',
      }

      UserService.findOneById.mockResolvedValue(user);
      await findOne(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User found",
        data: user
      });
    })
  })

  describe('Delete One User API', () => {
    const req = {
      params: { id: 'fakeid' }
    }

    it('should return success with user data and status code 200', async () => {
      const user = 'some id'

      UserService.deleteOne.mockResolvedValue(user);
      await deleteOne(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User deleted",
        data: user
      });
    })
  })

  describe('Update User API', () => {
    const req = {
      params: { id: 'fakeid' },
      body: {
        userName: 'fakeuser',
        emailAddress: 'fake@gmail.com',
      }
    }

    it('should return success with updated user data and status code 200', async () => {
      UserService.isDuplicate.mockResolvedValue(false);
      UserService.updateOne.mockResolvedValue(req.params.id);

      await update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User updated",
        data: req.params.id
      });
    });

    it('should handle errors', async () => {
      const errorMessage = { message: 'Error message' };
      UserService.updateOne.mockRejectedValue(errorMessage);
      await update(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it('should handle duplicate user data', async () => {
      const errorMessage = { message: 'Duplicate data found', code: 400 };
      UserService.isDuplicate.mockImplementation(() => {
        throw errorMessage;
      });
      await update(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('Generate Token API', () => {
    it('should return success with token data and status code 200', async () => {
      const token = 'fakeToken';
      UserService.generateToken.mockResolvedValue(token);
      await generateToken({}, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Token generated',
        data: token,
      });
    });

    it('should handle errors', async () => {
      const errorMessage = { message: 'Error message' };
      UserService.generateToken.mockRejectedValue(errorMessage);
      await generateToken({}, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('Find By Identity Number API', () => {
    const req = {
      params: { identityNumber: '344413' }
    }

    it('should return success with user data and status code 200', async () => {
      const user = {
        userName: 'fakeuser',
        emailAddress: 'fake@gmail.com',
        accountNumber: '1101010',
        identityNumber: '344413'
      }
      UserService.findByIdentityNumber.mockResolvedValue(user);
      await findByIdentityNumber(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User found",
        data: user
      });
    });

    it('should throw an error with status code 404 when no user is found', async () => {
      UserService.findByIdentityNumber.mockResolvedValue(null);
      await findByIdentityNumber(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }));
    });
  })

  describe('Find By Account Number API', () => {
    const req = {
      params: { accountNumber: '1101010' }
    }

    it('should return success with user data and status code 200', async () => {
      const user = {
        userName: 'fakeuser',
        emailAddress: 'fake@gmail.com',
        accountNumber: '1101010',
        identityNumber: '344413'
      }
      UserService.findByAccountNumber.mockResolvedValue(user);
      await findByAccountNumber(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User found",
        data: user
      });
    });

    it('should throw an error with status code 404 when no user is found', async () => {
      UserService.findByAccountNumber.mockResolvedValue(null);
      await findByAccountNumber(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ code: 404 }));
    });
  })

  afterAll(() => {
    redis.quit();
  })
});