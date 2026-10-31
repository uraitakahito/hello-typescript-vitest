import { page, userEvent } from 'vitest/browser';
import { mountTodo } from '../../src/todo';

test('ToDo の見た目', async () => {
  localStorage.clear();
  document.body.innerHTML = '<main id="app"></main>';
  mountTodo(document.querySelector<HTMLElement>('#app')!, localStorage);

  await userEvent.fill(page.getByLabelText('新しいタスク'), '牛乳を買う');
  await userEvent.click(page.getByRole('button', { name: '追加' }));
  await userEvent.fill(page.getByLabelText('新しいタスク'), 'パンを買う');
  await userEvent.click(page.getByRole('button', { name: '追加' }));
  await userEvent.click(page.getByRole('checkbox', { name: '牛乳を買う' }));

  await expect(page.getByRole('main')).toMatchScreenshot('todo');
});
