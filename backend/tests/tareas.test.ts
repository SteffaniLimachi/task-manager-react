import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../src/app'

describe('POST /tasks - validación de título', () => {
  it('rechaza crear una tarea con título vacío', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ text: '' })

    expect(res.status).toBe(400)
  })

  it('rechaza crear una tarea con título de solo espacios en blanco', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ text: '   ' })

    expect(res.status).toBe(999) // valor incorrecto a propósito (caso culpable)
  })
})
