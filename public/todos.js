$(function() {
  var $todoNameInput = $('#todoNameInput');
  var $todosContainer = $('.todo-list');

  setInterval((function() {
    // Load the todos from the server when the page is loaded
    $.get('/todos', function(todos) {
      var todosOnPage = $('.todo-item').length;

      if (todos.length === todosOnPage) {
        // Do nothing
      } else if (todos.length > todosOnPage) {
        //   0       1       2       3        4       5
        // [item 1, item 2, item 3, item 4, item 5, item 6]
        // todos.length = 6
        // todosOnPage  = 4
        //
        // some kind of loop that gives item 5, and then item 6
        // renderTodo(todo)
        var startIndex = todosOnPage;
        for (var i = startIndex; i < todos.length; i++) {
          renderTodo(todos[i]);
        }
      } else if (todos.length < todosOnPage) {
        // implement this!
        // find out what id exists on the page that does exist in the todos
        // array remove the element corresponding to that id
      }
    });
  }), 2000);

  $(document).ajaxStart(function() {
    $('.spinner').show();
  });

  $(document).ajaxStop(function() {
    $('.spinner').hide();
  });

  $(document).ajaxComplete(function(e, xhr) {
    if (xhr.statusText == 'error') {
      $('.ajax-error-warning').show();
    }
  });

  // For each of the todos in the array, call
  // renderTodo with it
  var renderTodos = function(todos) {
    $todosContainer.empty();
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
    $.post('/todos', {todo: {name: newTodoName}})
      .success(function(createdTodo) {
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
