export interface Todo {
  title: string
  done: boolean
}

const STORAGE_KEY = 'todos';

// Takes the storage as an argument so tests can pass a clean one.
export function mountTodo(root: HTMLElement, storage: Storage): void {
  const todos = load(storage);

  root.innerHTML = `
    <form>
      <label>新しいタスク <input name="title" required></label>
      <button type="submit">追加</button>
    </form>
    <ul aria-label="タスク"></ul>
    <p role="status"></p>
  `;
  const form = root.querySelector('form')!;
  const input = form.querySelector('input')!;
  const list = root.querySelector('ul')!;
  const status = root.querySelector('p')!;

  const render = () => {
    list.replaceChildren(...todos.map(renderItem));
    status.textContent = `残り ${todos.filter(todo => !todo.done).length} 件`;
  };

  // Every change saves the whole list and draws it again. That is simpler than patching the
  // DOM, and it keeps the index that renderItem binds to each task current.
  const saveAndRender = () => {
    save(storage, todos);
    render();
  };

  const renderItem = (todo: Todo, index: number) => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => {
      todos[index] = { ...todo, done: checkbox.checked };
      saveAndRender();
    });
    const label = document.createElement('label');
    label.append(checkbox, todo.title);
    const item = document.createElement('li');
    item.append(label);
    return item;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = input.value.trim();
    if (title === '') {
      return;
    }
    todos.push({ title, done: false });
    input.value = '';
    saveAndRender();
  });

  render();
}

function load(storage: Storage): Todo[] {
  return JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]') as Todo[];
}

function save(storage: Storage, todos: Todo[]): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
