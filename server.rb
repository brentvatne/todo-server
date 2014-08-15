require 'sinatra'
require 'sinatra/json'
require 'pry'

class TodoRepository
  @todos = {}
  @count = 0

  class << self
    def create(todo)
      @count = @count + 1
      todo['id'] = @count
      @todos[@count] = todo
    end

    def all
      @todos.values
    end

    def find(id)
      @todos[id]
    end

    def update(id, todo)
      todo['id'] = id
      @todos[id] = todo
    end

    def destroy(id)
      @todos.delete(id)
    end
  end
end

# Index
get '/todos' do
  json TodoRepository.all
end

# Show
get '/todos/:id' do
  json TodoRepository.find(params[:id].to_i)
end

# Create
post '/todos' do
  sleep 0.5
  json TodoRepository.create(params[:todo])
end

# Update
put '/todos/:id' do
  json TodoRepository.update(params[:id].to_i, params[:todo])
end

# Destroy
delete '/todos/:id' do
  json TodoRepository.destroy(params[:id].to_i)
end

# $.ajax({
#   url: '/todos/1',
#   type: 'DELETE',
#   success: function(result) {
#     console.log(result)
#   }
# });
#

# $.ajax({
#   url: '/todos/1',
#   type: 'PUT',
#   data: {todo: {name: 'New name!'}},
#   success: function(result) {
#     console.log(result)
#   }
# });
