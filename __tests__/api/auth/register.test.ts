import { POST } from '@/app/api/auth/register/route';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import * as emailService from '@/services/emailVerification.service';

vi.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
  },
}));

vi.mock('@/services/emailVerification.service', () => ({
  sendVerificationEmail: vi.fn(),
}));

describe('POST /api/auth/register', () => {
  const mockReq = (body: any) => ({
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Request);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register user successfully', async () => {
    const body = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    (prisma.user.findUnique as any).mockResolvedValue(null);
    (bcrypt.hash as any).mockResolvedValue('hashedPassword');
    (prisma.user.create as any).mockResolvedValue({
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

    (prisma.user.findUnique as any).mockResolvedValue({ id: 'existing' });

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
