$(function() {
  var $todoNameInput = $('#todoNameInput');
  var $todosContainer = $('.todo-list');

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
    var $todoEl = $('<li><span>' + todo.name + '</span></li>');
    var $completeCheckbox = $('<input type="checkbox"></input>');

    if (todo.complete == "true") {
      $todoEl.addClass('complete');
      $completeCheckbox.prop('checked', true);
    }

    $completeCheckbox.addClass('todo-complete-checkbox');
    $todoEl.prepend($completeCheckbox);
    $todoEl.addClass('todo-item');
    $todoEl.data('todo-id', todo.id);
    var $removeButton = $('<a>x</a>');
    $removeButton.addClass('todo-remove-button');
    $todoEl.append($removeButton);
    $todoEl.appendTo($todosContainer);
    $todoEl.addClass('animated rotateInUpLeft');
  }

  $(document).on('click', '.todo-complete-checkbox', function(e) {
    // Is it checked?
    var isComplete = $(this).is(':checked');
    // Find the parent todo-item container
    var $todoToComplete = $(this).parent('.todo-item');
    // Using the parent todo-item container, find the id from its data attribute
    var todoId = $todoToComplete.data('todo-id');

    if (isComplete) {
      $todoToComplete.addClass('complete');
    } else {
      $todoToComplete.removeClass('complete');
    }

    $.ajax({
      url: '/todos/' + todoId,
      type: 'PUT',
      data: {todo: {complete: isComplete}},
      success: function(result) {
        console.log(result)
      }
    });
  });

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
