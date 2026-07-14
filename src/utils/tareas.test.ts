import { describe, it, expect } from 'vitest'
import { contarTareasPendientes, esTituloValido } from './tareas'

describe('contarTareasPendientes', () => {
  it('cuenta solo las tareas no completadas', () => {
    // Arrange
    const tareas = [
      { id: 1, text: 'a', completed: true },
      { id: 2, text: 'b', completed: false },
      { id: 3, text: 'c', completed: false },
    ]
    // Act
    const resultado = contarTareasPendientes(tareas)
    // Assert
    expect(resultado).toBe(2)
  })

  it('devuelve 0 cuando la lista está vacía', () => {
    expect(contarTareasPendientes([])).toBe(0)
  })
})

describe('esTituloValido', () => {
  it('acepta un título con texto', () => {
    const titulo = 'Comprar pan'
    const resultado = esTituloValido(titulo)
    expect(resultado).toBe(true)
  })

  it('rechaza un título con solo espacios en blanco', () => {
    const titulo = '   '
    const resultado = esTituloValido(titulo)
    expect(resultado).toBe(false)
  })
})
