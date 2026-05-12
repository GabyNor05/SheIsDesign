import { rest } from 'msw';

const API_BASE = 'http://localhost:5160/api';

export const handlers = [
  rest.post(`${API_BASE}/User`, (req, res, ctx) =>
    res(ctx.status(201), ctx.json({ id: 1, email: 'test@test.com', dateCreated: '2026-01-01', role: 'user' }))
  ),

  rest.post(`${API_BASE}/User/Login`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ id: 1, email: 'test@test.com', dateCreated: '2026-01-01', role: 'user' }))
  ),

  rest.post(`${API_BASE}/Mentee`, (req, res, ctx) =>
    res(ctx.status(201), ctx.json({ id: 1, fullname: 'Jane Doe', university: 'UCT', year_of_study: 2, field_of_study: 'CS' }))
  ),

  rest.post(`${API_BASE}/IndustryProfessional`, (req, res, ctx) =>
    res(ctx.status(201), ctx.json({ id: 1, institution: 'Acme Corp', job_title: 'Engineer', userId: 1 }))
  ),
];
