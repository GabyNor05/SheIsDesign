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
  it('sends the correct request body', async () => {
    // arrange
    let capturedBody;
    server.use(
      rest.post(`${API_BASE}/User`, async (req, res, ctx) => {
        capturedBody = await req.json();
        return res(ctx.status(201), ctx.json({ id: 1, email: 'test@test.com', dateCreated: '2026-01-01', role: 'user' }));
      })
    );

    // act
    await registerUser('test@test.com', 'password123');

    // assert
    expect(capturedBody).toEqual({ email: 'test@test.com', password: 'password123' });
  });

  it('returns user data on success', async () => {
    // arrange (default handler returns 201 with user object)

    // act
    const result = await registerUser('test@test.com', 'password123');

    // assert
    expect(result).toEqual({ id: 1, email: 'test@test.com', dateCreated: '2026-01-01', role: 'user' });
  });

  it('throws with response text on non-ok response', async () => {
    // arrange
    server.use(
      rest.post(`${API_BASE}/User`, (req, res, ctx) =>
        res(ctx.status(400), ctx.text('Email already exists'))
      )
    );

    // act & assert
    await expect(registerUser('dup@test.com', 'pass')).rejects.toThrow('Email already exists');
  });

  it('throws default message when error response body is empty', async () => {
    // arrange
    server.use(
      rest.post(`${API_BASE}/User`, (req, res, ctx) =>
        res(ctx.status(500), ctx.text(''))
      )
    );

    // act & assert
    await expect(registerUser('x@x.com', 'pass')).rejects.toThrow('Registration failed');
  });
});

describe('loginUser', () => {
  it('sends the correct request body', async () => {
    // arrange
    let capturedBody;
    server.use(
      rest.post(`${API_BASE}/User/Login`, async (req, res, ctx) => {
        capturedBody = await req.json();
        return res(ctx.status(200), ctx.json({ id: 1, email: 'test@test.com', dateCreated: '2026-01-01', role: 'user' }));
      })
    );

    // act
    await loginUser('test@test.com', 'password123');

    // assert
    expect(capturedBody).toEqual({ email: 'test@test.com', password: 'password123' });
  });

  it('returns user data on success', async () => {
    // arrange (default handler returns 200 with user object)

    // act
    const result = await loginUser('test@test.com', 'password123');

    // assert
    expect(result).toEqual({ id: 1, email: 'test@test.com', dateCreated: '2026-01-01', role: 'user' });
  });

  it('throws with response text on 401', async () => {
    // arrange
    server.use(
      rest.post(`${API_BASE}/User/Login`, (req, res, ctx) =>
        res(ctx.status(401), ctx.text('Invalid credentials'))
      )
    );

    // act & assert
    await expect(loginUser('wrong@test.com', 'badpass')).rejects.toThrow('Invalid credentials');
  });

  it('throws default message when error response body is empty', async () => {
    // arrange
    server.use(
      rest.post(`${API_BASE}/User/Login`, (req, res, ctx) =>
        res(ctx.status(401), ctx.text(''))
      )
    );

    // act & assert
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

  it('sends the correct request body', async () => {
    // arrange
    let capturedBody;
    server.use(
      rest.post(`${API_BASE}/Student`, async (req, res, ctx) => {
        capturedBody = await req.json();
        return res(ctx.status(201), ctx.json({ id: 1, fullname: 'Jane Doe', university: 'UCT' }));
      })
    );

    // act
    await createMentee(menteeData);

    // assert
    expect(capturedBody).toEqual({
      fullname: 'Jane Doe',
      university: 'UCT',
      year_of_study: 2,
      field_of_study: 'Computer Science',
      student_number: 'S12345',
      wants_volunteer: true,
      userId: 1,
    });
  });

  it('returns student data on success', async () => {
    // arrange (default handler returns 201 with student object)

    // act
    const result = await createMentee(menteeData);

    // assert
    expect(result).toMatchObject({ fullname: 'Jane Doe', university: 'UCT' });
  });

  it('throws with response text on failure', async () => {
    // arrange
    server.use(
      rest.post(`${API_BASE}/Student`, (req, res, ctx) =>
        res(ctx.status(400), ctx.text('Invalid student data'))
      )
    );

    // act & assert
    await expect(createMentee(menteeData)).rejects.toThrow('Invalid student data');
  });

  it('throws default message when error response body is empty', async () => {
    // arrange
    server.use(
      rest.post(`${API_BASE}/Student`, (req, res, ctx) =>
        res(ctx.status(500), ctx.text(''))
      )
    );

    // act & assert
    await expect(createMentee(menteeData)).rejects.toThrow('Failed to save student details');
  });
});

describe('createIndustryProfessional', () => {
  const profData = { institution: 'Acme Corp', job_title: 'Engineer', userId: 1 };

  it('sends the correct request body', async () => {
    // arrange
    let capturedBody;
    server.use(
      rest.post(`${API_BASE}/IndustryProfessional`, async (req, res, ctx) => {
        capturedBody = await req.json();
        return res(ctx.status(201), ctx.json({ id: 1, institution: 'Acme Corp', job_title: 'Engineer', userId: 1 }));
      })
    );

    // act
    await createIndustryProfessional(profData);

    // assert
    expect(capturedBody).toEqual({ institution: 'Acme Corp', job_title: 'Engineer', userId: 1 });
  });

  it('returns professional data on success', async () => {
    // arrange (default handler returns 201 with professional object)

    // act
    const result = await createIndustryProfessional(profData);

    // assert
    expect(result).toMatchObject({ institution: 'Acme Corp', job_title: 'Engineer' });
  });

  it('throws with response text on failure', async () => {
    // arrange
    server.use(
      rest.post(`${API_BASE}/IndustryProfessional`, (req, res, ctx) =>
        res(ctx.status(400), ctx.text('User not found'))
      )
    );

    // act & assert
    await expect(createIndustryProfessional(profData)).rejects.toThrow('User not found');
  });

  it('throws default message when error response body is empty', async () => {
    // arrange
    server.use(
      rest.post(`${API_BASE}/IndustryProfessional`, (req, res, ctx) =>
        res(ctx.status(500), ctx.text(''))
      )
    );

    // act & assert
    await expect(createIndustryProfessional(profData)).rejects.toThrow('Failed to save professional details');
  });
});
