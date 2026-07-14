import { test, expect } from '@playwright/test'

test('un usuario puede crear una tarea y verla en la lista', async ({ page }) => {
  // Mock de la API: el objetivo de esta prueba es el flujo de UI
  // (entrar, escribir, hacer clic, ver el resultado), no la base de datos.
  const tasks: { id: number; text: string; completed: boolean }[] = []

  await page.route('**/tasks', async (route) => {
    const request = route.request()

    if (request.method() === 'GET') {
      await route.fulfill({ json: tasks })
      return
    }

    if (request.method() === 'POST') {
      const body = request.postDataJSON()
      const newTask = { id: tasks.length + 1, text: body.text, completed: body.completed ?? false }
      tasks.push(newTask)
      await route.fulfill({ json: newTask })
      return
    }

    await route.continue()
  })

  // 1. Entrar a la aplicación
  await page.goto('/')

  // 2. Crear una tarea
  await page.getByPlaceholder('Escribe una tarea...').fill('Comprar pan')
  await page.getByRole('button', { name: 'Agregar' }).click()

  // 3. Verla en la lista
  await expect(page.getByText('Comprar pan')).toBeVisible()
})
