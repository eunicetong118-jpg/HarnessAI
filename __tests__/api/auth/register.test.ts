import { POST } from '@/app/api/auth/register/route';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import * as emailService from '@/services/emailVerification.service';

jest.mock('@/lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

jest.mock('@/services/emailVerification.service', () => ({
  sendVerificationEmail: jest.fn(),
}));

describe('POST /api/auth/register', () => {
  const mockReq = (body: any) => ({
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Request);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register user successfully', async () => {
    const body = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'user-id',
      email: body.email,
    });

    const res = await POST(mockReq(body));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.message).toMatch(/successful/i);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: body.name,
        email: body.email,
        password: 'hashedPassword',
      },
    });
    expect(emailService.sendVerificationEmail).toHaveBeenCalledWith('user-id', body.email);
  });

  it('should return 409 if user exists', async () => {
    const body = {
      name: 'Test User',
      email: 'existing@example.com',
      password: 'password123',
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'existing' });

    const res = await POST(mockReq(body));
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.error).toBe('User already exists');
  });

  it('should return 400 for invalid input', async () => {
    const body = {
      name: '',
      email: 'invalid-email',
      password: 'short',
    };

    const res = await POST(mockReq(body));
    expect(res.status).toBe(400);
  });
});
