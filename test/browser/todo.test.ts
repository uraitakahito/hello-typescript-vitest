import { page, userEvent } from 'vitest/browser';
import { mountTodo } from '../../src/todo';

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '<main id="app"></main>';
  mountTodo(document.querySelector<HTMLElement>('#app')!, localStorage);
});

async function addTask(title: string): Promise<void> {
  await userEvent.fill(page.getByLabelText('新しいタスク'), title);
  await userEvent.click(page.getByRole('button', { name: '追加' }));
}

test('タスクを追加すると一覧と残り件数に出る', async () => {
  await addTask('牛乳を買う');

  await expect.element(page.getByRole('listitem')).toHaveTextContent('牛乳を買う');
  await expect.element(page.getByRole('status')).toHaveTextContent('残り 1 件');
});

test('完了にすると残り件数が減る', async () => {
  await addTask('牛乳を買う');
  await userEvent.click(page.getByRole('checkbox', { name: '牛乳を買う' }));

  await expect.element(page.getByRole('status')).toHaveTextContent('残り 0 件');
});

test('同じストレージで描き直すとタスクが残っている', async () => {
  await addTask('牛乳を買う');

  // Browser Mode cannot reload the page, so mount again with the same storage.
  mountTodo(document.querySelector<HTMLElement>('#app')!, localStorage);

  await expect.element(page.getByRole('listitem')).toHaveTextContent('牛乳を買う');
});
