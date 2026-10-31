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

function deleteButton(title: string) {
  return page.getByRole('button', { name: `「${title}」を削除` });
}

test('タスクを追加すると一覧と残り件数に出る', async () => {
  await addTask('牛乳を買う');

  await expect.element(page.getByRole('checkbox', { name: '牛乳を買う' })).toBeInTheDocument();
  await expect.element(page.getByRole('status')).toHaveTextContent('残り 1 件');
});

test('前後の空白を除いた名前で追加する', async () => {
  await addTask('  牛乳を買う  ');

  // The default whitespace normalization would hide spaces that were not trimmed.
  await expect.element(page.getByText('牛乳を買う')).toHaveTextContent('牛乳を買う', { normalizeWhitespace: false });
});

test('空白だけの名前は追加しない', async () => {
  await addTask('   ');

  await expect.element(page.getByRole('listitem')).not.toBeInTheDocument();
});

test('同じ名前のタスクも追加できる', async () => {
  await addTask('牛乳を買う');
  await addTask('牛乳を買う');

  await expect.element(page.getByRole('listitem')).toHaveLength(2);
});

test('完了にすると残り件数が減る', async () => {
  await addTask('牛乳を買う');
  await userEvent.click(page.getByRole('checkbox', { name: '牛乳を買う' }));

  await expect.element(page.getByRole('status')).toHaveTextContent('残り 0 件');
});

test('チェックを外すと残り件数が戻る', async () => {
  await addTask('牛乳を買う');
  await userEvent.click(page.getByRole('checkbox', { name: '牛乳を買う' }));
  await userEvent.click(page.getByRole('checkbox', { name: '牛乳を買う' }));

  await expect.element(page.getByRole('status')).toHaveTextContent('残り 1 件');
});

test('削除すると一覧から消える', async () => {
  await addTask('牛乳を買う');
  await userEvent.click(deleteButton('牛乳を買う'));

  await expect.element(page.getByRole('listitem')).not.toBeInTheDocument();
});

test('未完了のタスクを削除すると残り件数が減る', async () => {
  await addTask('牛乳を買う');
  await addTask('パンを買う');
  await userEvent.click(deleteButton('牛乳を買う'));

  await expect.element(page.getByRole('status')).toHaveTextContent('残り 1 件');
});

test('同じ名前のタスクは押したものだけを削除する', async () => {
  await addTask('牛乳を買う');
  await addTask('牛乳を買う');
  await userEvent.click(page.getByRole('checkbox', { name: '牛乳を買う' }).nth(1));
  await userEvent.click(deleteButton('牛乳を買う').nth(1));

  // Only the first task, which was left open, remains.
  await expect.element(page.getByRole('checkbox', { name: '牛乳を買う' })).not.toBeChecked();
});

test('削除したあとは次のタスクの削除ボタンにフォーカスが移る', async () => {
  await addTask('牛乳を買う');
  await addTask('パンを買う');
  await userEvent.click(deleteButton('牛乳を買う'));

  await expect.element(deleteButton('パンを買う')).toHaveFocus();
});

test('一覧の最後のタスクを削除すると前のタスクの削除ボタンにフォーカスが移る', async () => {
  await addTask('牛乳を買う');
  await addTask('パンを買う');
  await userEvent.click(deleteButton('パンを買う'));

  await expect.element(deleteButton('牛乳を買う')).toHaveFocus();
});

test('最後の 1 件を削除すると入力欄にフォーカスが移る', async () => {
  await addTask('牛乳を買う');
  await userEvent.click(deleteButton('牛乳を買う'));

  await expect.element(page.getByLabelText('新しいタスク')).toHaveFocus();
});

test('同じストレージで描き直すとタスクが残っている', async () => {
  await addTask('牛乳を買う');

  // Browser Mode cannot reload the page, so mount again with the same storage.
  mountTodo(document.querySelector<HTMLElement>('#app')!, localStorage);

  await expect.element(page.getByRole('checkbox', { name: '牛乳を買う' })).toBeInTheDocument();
});

test('削除したタスクは同じストレージで描き直しても戻らない', async () => {
  await addTask('牛乳を買う');
  await userEvent.click(deleteButton('牛乳を買う'));

  // Browser Mode cannot reload the page, so mount again with the same storage.
  mountTodo(document.querySelector<HTMLElement>('#app')!, localStorage);

  await expect.element(page.getByRole('listitem')).not.toBeInTheDocument();
});
