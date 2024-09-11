document.addEventListener('DOMContentLoaded', function () {
    var darkModeBtn = document.querySelector('.dark-mode-btn');
    var addTaskBtn = document.querySelector('#add-task-btn');
    var newTaskInput = document.querySelector('#new-task');
    var dueDateInput = document.querySelector('#due-date');
    var todoList = document.querySelector('.todo-list');
    var filterTasksInput = document.querySelector('#filter-tasks');
    var clearCompletedBtn = document.querySelector('#clear-completed');
    var downloadBtn = document.querySelector('#download-btn');
    var taskCounter = -1;
    function updateTaskNumbers(startIndex) {
        var tasks = Array.from((todoList === null || todoList === void 0 ? void 0 : todoList.querySelectorAll('li')) || []);
        for (var i = startIndex; i < tasks.length; i++) {
            var span = tasks[i].querySelector('span');
            var taskText = span.textContent;
            var newTaskText = taskText.replace(/^(\d+)-/, function (match, p1) { return "".concat(parseInt(p1, 10) - 1, "-"); });
            span.textContent = newTaskText;
        }
        taskCounter--;
    }
    function createTaskHTML(taskText, dueDate) {
        var taskNumber = taskCounter + 1;
        var taskDueDate = dueDate ? " (Due: ".concat(dueDate, ")") : '';
        return "<li><span data-due-date=\"".concat(dueDate || '', "\">").concat(taskNumber, "- ").concat(taskText).concat(taskDueDate, "</span><button class=\"delete-btn\">Delete</button></li>");
    }
    function applyButtonStyles(button) {
        button.style.backgroundColor = 'red';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '35vw';
        button.style.borderRadius = '10px';
        button.style.maxWidth = '600px';
        button.addEventListener('mouseover', function () {
            button.style.backgroundColor = 'rgb(173, 0, 0)';
            button.style.transform = 'scale(1.1)';
            button.style.transition = 'all 0.3s ease-in-out';
        });
        button.addEventListener('mouseout', function () {
            button.style.backgroundColor = 'red';
            button.style.transform = 'scale(1)';
            button.style.transition = 'all 0.3s ease-in-out';
        });
    }
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', function () {
            var _a, _b;
            document.body.classList.toggle('dark-mode');
            (_a = document.querySelector('.container')) === null || _a === void 0 ? void 0 : _a.classList.toggle('dark-mode');
            (_b = document.querySelector('header')) === null || _b === void 0 ? void 0 : _b.classList.toggle('dark-mode');
            darkModeBtn.classList.toggle('dark-mode');
        });
    }
    if (addTaskBtn && newTaskInput && dueDateInput && todoList) {
        addTaskBtn.addEventListener('click', function () {
            var newTask = newTaskInput.value.trim();
            var dueDate = dueDateInput.value.trim();
            if (newTask !== '') {
                taskCounter++;
                var taskHTML = createTaskHTML(newTask, dueDate);
                todoList.insertAdjacentHTML('beforeend', taskHTML);
                Array.from(todoList.querySelectorAll('.delete-btn')).forEach(function (button) { return applyButtonStyles(button); });
                newTaskInput.value = '';
                dueDateInput.value = '';
            }
        });
        newTaskInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                var newTask = newTaskInput.value.trim();
                var dueDate = dueDateInput.value.trim();
                if (newTask !== '') {
                    taskCounter++;
                    var taskHTML = createTaskHTML(newTask, dueDate);
                    todoList.insertAdjacentHTML('beforeend', taskHTML);
                    Array.from(todoList.querySelectorAll('.delete-btn')).forEach(function (button) { return applyButtonStyles(button); });
                    newTaskInput.value = '';
                    dueDateInput.value = '';
                }
            }
        });
        todoList.addEventListener('click', function (e) {
            var _a;
            var target = e.target;
            if (target.classList.contains('delete-btn')) {
                var taskItem_1 = target.closest('li');
                var taskIndex_1 = Array.from(todoList.children).indexOf(taskItem_1);
                taskItem_1.classList.add('fade-out'); // Assuming you have a CSS class for fade-out effect
                setTimeout(function () {
                    taskItem_1.remove();
                    updateTaskNumbers(taskIndex_1);
                }, 500);
            }
            else if (target.tagName === 'SPAN') {
                (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.classList.toggle('completed');
            }
        });
        todoList.addEventListener('dblclick', function (e) {
            var target = e.target;
            if (target.tagName === 'SPAN') {
                var taskText = target.textContent;
                var inputHTML = "<input type=\"text\" value=\"".concat(taskText, "\">");
                target.parentElement.innerHTML = inputHTML;
                var input = target.parentElement.querySelector('input');
                input.focus();
            }
        });
        todoList.addEventListener('blur', function (e) {
            var target = e.target;
            if (target.tagName === 'INPUT') {
                var newTaskText = target.value;
                var deleteBtnHTML = '<button class="delete-btn">Delete</button>';
                target.parentElement.innerHTML = "<span>".concat(newTaskText, "</span>").concat(deleteBtnHTML);
                Array.from(target.parentElement.querySelectorAll('.delete-btn')).forEach(function (button) { return applyButtonStyles(button); });
            }
        }, true);
        todoList.addEventListener('keypress', function (e) {
            var target = e.target;
            if (target.tagName === 'INPUT' && e.key === 'Enter') {
                var newTaskText = target.value;
                var deleteBtnHTML = '<button class="delete-btn">Delete</button>';
                target.parentElement.innerHTML = "<span>".concat(newTaskText, "</span>").concat(deleteBtnHTML);
                Array.from(target.parentElement.querySelectorAll('.delete-btn')).forEach(function (button) { return applyButtonStyles(button); });
            }
        });
        filterTasksInput === null || filterTasksInput === void 0 ? void 0 : filterTasksInput.addEventListener('keyup', function () {
            var filterText = filterTasksInput.value.toLowerCase();
            Array.from(todoList.querySelectorAll('li')).forEach(function (li) {
                var taskText = li.textContent.toLowerCase();
                li.style.display = taskText.includes(filterText) ? '' : 'none';
            });
        });
        clearCompletedBtn === null || clearCompletedBtn === void 0 ? void 0 : clearCompletedBtn.addEventListener('click', function () {
            Array.from(todoList.querySelectorAll('li.completed')).forEach(function (li) { return li.remove(); });
        });
    }
    if (downloadBtn && todoList) {
        downloadBtn.addEventListener('click', function () {
            var csvData = generateCsvData();
            var blob = new Blob([csvData], { type: 'text/csv' });
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'todo-list.csv';
            document.body.appendChild(link); // Append to the body
            link.click(); // Simulate a click
            document.body.removeChild(link); // Remove after clicking
        });
    }
    function generateCsvData() {
        var listItems = Array.from(todoList.querySelectorAll('li')).map(function (item) {
            var span = item.querySelector('span');
            var taskText = span.textContent.replace(/^\d+-\s*/, '').trim(); // Fix regex to handle task number
            return "\"".concat(taskText, "\"");
        });
        return 'Task\n' + listItems.join('\n') + '\n';
    }
});
