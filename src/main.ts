import { mountTodo } from './todo';

mountTodo(document.querySelector<HTMLElement>('#app')!, localStorage);
