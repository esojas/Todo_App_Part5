import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTodos, createTodo, updateTodo, deleteTodo } from '../features/todo/todoSlice';
import { getUserInfo, logout } from '../features/auth/authSlice';
import { useNavigate, Navigate } from 'react-router-dom';

const Dashboard = () => {
    const [newTodo, setNewTodo] = useState({
        todo_name: '',
        todo_desc: '',
        todo_status: 'active',
        todo_image: 'https://api.dicebear.com/9.x/icons/svg?seed=' + Math.random(),
    });

    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { todos, loading: todosLoading } = useSelector((state) => state.todo);
    const { user, loading: userLoading, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!isAuthenticated) {
                console.log('Not authenticated, redirecting to login');
                navigate('/login');
                return;
            }

            try {
                if (!user && !userLoading) {
                    console.log('Fetching user info...');
                    const userResult = await dispatch(getUserInfo());
                    if (userResult.error) {
                        console.log('Error fetching user info:', userResult.error);
                        navigate('/login');
                        return;
                    }
                }

                if (isMounted && !todosLoading) {
                    console.log('Fetching todos...');
                    await dispatch(getAllTodos());
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (isMounted) {
                    navigate('/login');
                }
            } finally {
                if (isMounted) {
                    setIsInitialLoad(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [dispatch, navigate, isAuthenticated, user, userLoading, todosLoading]);

    const handleCreateTodo = async (e) => {
        e.preventDefault();
        try {
            console.log('Creating todo:', newTodo);
            const result = await dispatch(createTodo(newTodo));
            console.log('Create todo result:', result);
            
            setNewTodo({
                todo_name: '',
                todo_desc: '',
                todo_status: 'active',
                todo_image: 'https://api.dicebear.com/9.x/icons/svg?seed=' + Math.random(),
            });
        } catch (error) {
            console.error('Error creating todo:', error);
        }
    };

    const handleUpdateTodo = async (id, status) => {
        try {
            console.log('Updating todo:', { id, status });
            const todo = todos.find((t) => t._id === id);
            if (todo) {
                const result = await dispatch(updateTodo({
                    id,
                    todoData: { ...todo, todo_status: status }
                }));
                console.log('Update todo result:', result);
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            console.log('Deleting todo:', id);
            const result = await dispatch(deleteTodo(id));
            console.log('Delete todo result:', result);
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const handleLogout = async () => {
        try {
            console.log('Logging out...');
            await dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    console.log('Rendering Dashboard:', { userLoading, todosLoading, user, isAuthenticated, todos });

    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/login" />;
    }

    if (isInitialLoad && (userLoading || todosLoading)) {
        console.log('Showing loading state:', { userLoading, todosLoading });
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="text-2xl font-semibold mb-4">Loading...</div>
                    <div className="text-gray-600">
                        {userLoading && <div>Loading user information...</div>}
                        {todosLoading && <div>Loading todos...</div>}
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        console.log('No user found, redirecting to login');
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold">Todo App</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-700">
                                Welcome, {user?.name}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-medium mb-4">Create New Todo</h2>
                        <form onSubmit={handleCreateTodo} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Todo Name"
                                    value={newTodo.todo_name}
                                    onChange={(e) => setNewTodo({ ...newTodo, todo_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <textarea
                                    placeholder="Todo Description"
                                    value={newTodo.todo_desc}
                                    onChange={(e) => setNewTodo({ ...newTodo, todo_desc: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Add Todo
                            </button>
                        </form>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium mb-4">Your Todos</h2>
                        <div className="space-y-4">
                            {todos && todos.length > 0 ? (
                                todos.map((todo) => (
                                    <div
                                        key={todo._id}
                                        className="border rounded-lg p-4 flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={todo.todo_image}
                                                alt="Todo"
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div>
                                                <h3 className="font-medium">{todo.todo_name}</h3>
                                                <p className="text-gray-600">{todo.todo_desc}</p>
                                                <span className={`text-sm ${
                                                    todo.todo_status === 'active' ? 'text-green-600' : 'text-gray-600'
                                                }`}>
                                                    {todo.todo_status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleUpdateTodo(todo._id, todo.todo_status === 'active' ? 'completed' : 'active')}
                                                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                                            >
                                                {todo.todo_status === 'active' ? 'Complete' : 'Reactivate'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTodo(todo._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">
                                    No todos yet. Create your first todo!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard; 