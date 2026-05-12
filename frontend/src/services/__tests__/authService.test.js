import { rest } from 'msw';
import { server } from '../../mocks/server';
import {
  registerUser,
  loginUser,
  createMentee,
  createIndustryProfessional,
} from '../authService';

const API_BASE = 'http://localhost:5160/api';

describe('registerUser', () => {
  it('returns user data on success', async () => {
    const result = await registerUser('test@test.com', 'password123');
    expect(result).toEqual({ id: 1, email: 'test@test.com', dateCreated: '2026-01-01', role: 'user' });
  });

  it('throws with response text on non-ok response', async () => {
    server.use(
      rest.post(`${API_BASE}/User`, (req, res, ctx) =>
        res(ctx.status(400), ctx.text('Email already exists'))
      )
    );
    await expect(registerUser('dup@test.com', 'pass')).rejects.toThrow('Email already exists');
  });

  it('throws default message when error response body is empty', async () => {
    server.use(
      rest.post(`${API_BASE}/User`, (req, res, ctx) =>
        res(ctx.status(500), ctx.text(''))
      )
    );
    await expect(registerUser('x@x.com', 'pass')).rejects.toThrow('Registration failed');
  });
});

describe('loginUser', () => {
  it('returns user data on success', async () => {
    const result = await loginUser('test@test.com', 'password123');
    expect(result).toEqual({ id: 1, email: 'test@test.com', dateCreated: '2026-01-01', role: 'user' });
  });

  it('throws with response text on 401', async () => {
    server.use(
      rest.post(`${API_BASE}/User/Login`, (req, res, ctx) =>
        res(ctx.status(401), ctx.text('Invalid credentials'))
      )
    );
    await expect(loginUser('wrong@test.com', 'badpass')).rejects.toThrow('Invalid credentials');
  });

  it('throws default message when error response body is empty', async () => {
    server.use(
      rest.post(`${API_BASE}/User/Login`, (req, res, ctx) =>
        res(ctx.status(401), ctx.text(''))
      )
    );
    await expect(loginUser('x@x.com', 'pass')).rejects.toThrow('Login failed');
  });
});

describe('createMentee', () => {
  const menteeData = {
    fullname: 'Jane Doe',
    university: 'UCT',
    year_of_study: 2,
    field_of_study: 'Computer Science',
    student_number: 'S12345',
    wants_volunteer: true,
    userId: 1,
  };

  it('returns student data on success', async () => {
    const result = await createMentee(menteeData);
    expect(result).toMatchObject({ fullname: 'Jane Doe', university: 'UCT' });
  });

  it('throws with response text on failure', async () => {
    server.use(
      rest.post(`${API_BASE}/Mentee`, (req, res, ctx) =>
        res(ctx.status(400), ctx.text('Invalid student data'))
      )
    );
    await expect(createMentee(menteeData)).rejects.toThrow('Invalid student data');
  });

  it('throws default message when error response body is empty', async () => {
    server.use(
      rest.post(`${API_BASE}/Mentee`, (req, res, ctx) =>
        res(ctx.status(500), ctx.text(''))
      )
    );
    await expect(createMentee(menteeData)).rejects.toThrow('Failed to save student details');
  });
});

describe('createIndustryProfessional', () => {
  const profData = { institution: 'Acme Corp', job_title: 'Engineer', userId: 1 };

  it('returns professional data on success', async () => {
    const result = await createIndustryProfessional(profData);
    expect(result).toMatchObject({ institution: 'Acme Corp', job_title: 'Engineer' });
  });

  it('throws with response text on failure', async () => {
    server.use(
      rest.post(`${API_BASE}/IndustryProfessional`, (req, res, ctx) =>
        res(ctx.status(400), ctx.text('User not found'))
      )
    );
    await expect(createIndustryProfessional(profData)).rejects.toThrow('User not found');
  });

  it('throws default message when error response body is empty', async () => {
    server.use(
      rest.post(`${API_BASE}/IndustryProfessional`, (req, res, ctx) =>
        res(ctx.status(500), ctx.text(''))
      )
    );
    await expect(createIndustryProfessional(profData)).rejects.toThrow('Failed to save professional details');
  });
});
