$(function() {
  var $todoNameInput = $('#todoNameInput');
  var $todosContainer = $('.todo-list');

  // For each of the todos in the array, call
  // renderTodo with it
  var renderTodos = function(todos) {
    $.each(todos, function(i, todo) {
      renderTodo(todo);
    });
  }

  // Given a todo (a JavaScript object that has a name
  // property) eg: {name: 'Buy groceries'}, add it to
  // the todo list and animate it in
  var renderTodo = function(todo) {
    var $todoEl = $('<li>' + todo.name + '</li>');
    $todoEl.addClass('todo-item');
    $todoEl.data('todo-id', todo.id);
    var $removeButton = $('<a>x</a>');
    $removeButton.addClass('todo-remove-button');
    $todoEl.append($removeButton);
    $todoEl.appendTo($todosContainer);
    $todoEl.addClass('animated rotateInUpLeft');
  }

  $(document).on('click', '.todo-remove-button', function(e) {
    var $todoToRemove = $(this).parent('.todo-item');
    var todoId = $todoToRemove.data('todo-id');
    deleteTodo(todoId);
    $todoToRemove.remove();
  });

  var createTodo = function(newTodoName) {
    $.post('/todos', {todo: {name: newTodoName}}, function(createdTodo) {
      renderTodo(createdTodo);
   })
  }

  var deleteTodo = function(id) {
    $.ajax({
      url: '/todos/' + id,
      type: 'delete',
      success: function() {
        console.log("Deleted todo: " + id);
      }
    })
  }

  $('.new-todo-form').submit(function(e) {
    e.preventDefault();
    // Get the name of the todo from the input
    var newTodoName = $todoNameInput.val().trim();

    // Don't do anything if it's blank
    if (newTodoName === '') {
      alert('Todo cannot be blank!');
    } else {
      createTodo(newTodoName);
      $todoNameInput.val('');
    }
  });

  // Load the todos from the server when the page is loaded
  $.get('/todos', function(todos) {
    renderTodos(todos);
  });
});
