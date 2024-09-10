document.addEventListener('DOMContentLoaded', () => {
    const darkModeBtn = document.querySelector('.dark-mode-btn') as HTMLButtonElement | null;
    const addTaskBtn = document.querySelector('#add-task-btn') as HTMLButtonElement | null;
    const newTaskInput = document.querySelector('#new-task') as HTMLInputElement | null;
    const dueDateInput = document.querySelector('#due-date') as HTMLInputElement | null;
    const todoList = document.querySelector('.todo-list') as HTMLUListElement | null;
    const filterTasksInput = document.querySelector('#filter-tasks') as HTMLInputElement | null;
    const clearCompletedBtn = document.querySelector('#clear-completed') as HTMLButtonElement | null;
    const downloadBtn = document.querySelector('#download-btn') as HTMLButtonElement | null;
    
    let taskCounter = -1;

    function updateTaskNumbers(startIndex: number) {
        const tasks = Array.from(todoList?.querySelectorAll('li') || []);
        for (let i = startIndex; i < tasks.length; i++) {
            const span = tasks[i].querySelector('span')!;
            const taskText = span.textContent!;
            const newTaskText = taskText.replace(/^(\d+)-/, (match, p1) => `${parseInt(p1, 10) - 1}-`);
            span.textContent = newTaskText;
        }
        taskCounter--;
    }

    function createTaskHTML(taskText: string, dueDate?: string) {
        const taskNumber = taskCounter + 1;
        const taskDueDate = dueDate ? ` (Due: ${dueDate})` : '';
        return `<li><span data-due-date="${dueDate || ''}">${taskNumber}- ${taskText}${taskDueDate}</span><button class="delete-btn">Delete</button></li>`;
    }

    function applyButtonStyles(button: HTMLButtonElement) {
        button.style.backgroundColor = 'red';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '80%';
        button.style.borderRadius = '10px';
        button.style.maxWidth = '600px';
        
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = 'rgb(173, 0, 0)';
            button.style.transform = 'scale(1.1)';
            button.style.transition = 'all 0.3s ease-in-out';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = 'red';
            button.style.transform = 'scale(1)';
            button.style.transition = 'all 0.3s ease-in-out';
        });
    }

    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            document.querySelector('.container')?.classList.toggle('dark-mode');
            document.querySelector('header')?.classList.toggle('dark-mode');
            darkModeBtn.classList.toggle('dark-mode');
        });
    }

    if (addTaskBtn && newTaskInput && dueDateInput && todoList) {
        addTaskBtn.addEventListener('click', () => {
            const newTask = newTaskInput.value.trim();
            const dueDate = dueDateInput.value.trim();
            if (newTask !== '') {
                taskCounter++;
                const taskHTML = createTaskHTML(newTask, dueDate);
                todoList.insertAdjacentHTML('beforeend', taskHTML);
                Array.from(todoList.querySelectorAll('.delete-btn')).forEach(button => applyButtonStyles(button as HTMLButtonElement));
                newTaskInput.value = '';
                dueDateInput.value = '';
            }
        });

        newTaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const newTask = newTaskInput.value.trim();
                const dueDate = dueDateInput.value.trim();
                if (newTask !== '') {
                    taskCounter++;
                    const taskHTML = createTaskHTML(newTask, dueDate);
                    todoList.insertAdjacentHTML('beforeend', taskHTML);
                    Array.from(todoList.querySelectorAll('.delete-btn')).forEach(button => applyButtonStyles(button as HTMLButtonElement));
                    newTaskInput.value = '';
                    dueDateInput.value = '';
                }
            }
        });

        todoList.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('delete-btn')) {
                const taskItem = target.closest('li')!;
                const taskIndex = Array.from(todoList.children).indexOf(taskItem);
                taskItem.classList.add('fade-out'); // Assuming you have a CSS class for fade-out effect
                setTimeout(() => {
                    taskItem.remove();
                    updateTaskNumbers(taskIndex);
                }, 500);
            } else if (target.tagName === 'SPAN') {
                target.parentElement?.classList.toggle('completed');
            }
        });

        todoList.addEventListener('dblclick', (e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'SPAN') {
                const taskText = target.textContent!;
                const inputHTML = `<input type="text" value="${taskText}">`;
                target.parentElement!.innerHTML = inputHTML;
                const input = target.parentElement!.querySelector('input')!;
                input.focus();
            }
        });

        todoList.addEventListener('blur', (e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT') {
                const newTaskText = (target as HTMLInputElement).value;
                const deleteBtnHTML = '<button class="delete-btn">Delete</button>';
                target.parentElement!.innerHTML = `<span>${newTaskText}</span>${deleteBtnHTML}`;
                Array.from(target.parentElement!.querySelectorAll('.delete-btn')).forEach(button => applyButtonStyles(button as HTMLButtonElement));
            }
        }, true);

        todoList.addEventListener('keypress', (e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' && e.key === 'Enter') {
                const newTaskText = (target as HTMLInputElement).value;
                const deleteBtnHTML = '<button class="delete-btn">Delete</button>';
                target.parentElement!.innerHTML = `<span>${newTaskText}</span>${deleteBtnHTML}`;
                Array.from(target.parentElement!.querySelectorAll('.delete-btn')).forEach(button => applyButtonStyles(button as HTMLButtonElement));
            }
        });

        filterTasksInput?.addEventListener('keyup', () => {
            const filterText = filterTasksInput.value.toLowerCase();
            Array.from(todoList.querySelectorAll('li')).forEach(li => {
                const taskText = li.textContent!.toLowerCase();
                li.style.display = taskText.includes(filterText) ? '' : 'none';
            });
        });

        clearCompletedBtn?.addEventListener('click', () => {
            Array.from(todoList.querySelectorAll('li.completed')).forEach(li => li.remove());
        });
    }

    if (downloadBtn && todoList) {
        downloadBtn.addEventListener('click', () => {
            const csvData = generateCsvData();
            const blob = new Blob([csvData], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'todo-list.csv';
            document.body.appendChild(link); // Append to the body
            link.click(); // Simulate a click
            document.body.removeChild(link); // Remove after clicking
        });
    }

    function generateCsvData() {
        const listItems = Array.from(todoList.querySelectorAll('li')).map(item => {
            const span = item.querySelector('span')!;
            const taskText = span.textContent!.replace(/^\d+-\s*/, '').trim(); // Fix regex to handle task number
            return `"${taskText}"`;
        });
        return 'Task\n' + listItems.join('\n') + '\n';
    }
});
