class App extends React.Component {
    state = {
        tasks: [],
        newTask: '',
        priority: 'low',
        category: '',
        dueDate: '',
        sortBy: 'none',
        filterByCategory: '',
        error: '',
        notification: ''
    };

    componentDidMount() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.setState({ tasks });
    }

    componentDidUpdate() {
        localStorage.setItem('tasks', JSON.stringify(this.state.tasks));
    }

    addTask = (e) => {
        e.preventDefault();
        const { tasks, newTask, priority, category, dueDate } = this.state;
        const currentDate = new Date().toISOString().split('T')[0];

        if (newTask.trim() === '') {
            this.setState({ error: 'Task title cannot be empty.' });
            return;
            
        }

        if (dueDate && dueDate < currentDate) {
            this.setState({ error: 'Due date cannot be in the past.' });
            return;
        }

        this.setState({
            tasks: [...tasks, { id: Date.now(), title: newTask, priority, category, dueDate, completed: false }],
            newTask: '',
            priority: 'low',
            category: '',
            dueDate: '',
            error: '',
            notification: 'Task added successfully!'
        });
        this.clearNotification();
    };

    toggleComplete = (taskId) => {
        this.setState({
            tasks: this.state.tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
            notification: 'Task status updated!'
        });
        this.clearNotification();
    };

    deleteTask = (taskId) => {
        this.setState({
            tasks: this.state.tasks.filter(task => task.id !== taskId),
            notification: 'Task deleted successfully!'
        });
        this.clearNotification();
    };

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSortChange = (e) => {
        this.setState({ sortBy: e.target.value });
    };

    handleFilterChange = (e) => {
        this.setState({ filterByCategory: e.target.value });
    };

    getFilteredAndSortedTasks = () => {
        const { tasks, sortBy, filterByCategory } = this.state;
        let filteredTasks = tasks;

        if (filterByCategory) {
            filteredTasks = tasks.filter(task => task.category === filterByCategory);
        }

        switch (sortBy) {
            case 'priority':
                return filteredTasks.sort((a, b) => {
                    const priorities = { low: 1, medium: 2, high: 3 };
                    return priorities[b.priority] - priorities[a.priority];
                });
            case 'dueDate':
                return filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            default:
                return filteredTasks;
        }
    };

    clearNotification = () => {
        setTimeout(() => {
            this.setState({ notification: '' });
        }, 3000);
    };

    render() {
        const tasks = this.getFilteredAndSortedTasks();

        return (
            <div className="container">
             <h1>&#x2705; To-Do List</h1>
                {this.state.notification && <p className="notification">{this.state.notification}</p>}
                <form onSubmit={this.addTask}>
                    <input
                        type="text"
                        name="newTask"
                        value={this.state.newTask}
                        onChange={this.handleInputChange}
                        placeholder="enter your roll number"
                    />
                    
                    <select name="priority" value={this.state.priority} onChange={this.handleInputChange}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    
                    <input
                        type="text"
                        name="category"
                        value={this.state.category}
                        onChange={this.handleInputChange}
                        placeholder="enter your name here"
                    />
                    <input
                        type="date"
                        name="dueDate"
                        value={this.state.dueDate}
                        onChange={this.handleInputChange}
                    />
                    <button type="submit">Add Task</button>
                </form>
                {this.state.error && <p className="error">{this.state.error}</p>}
                <div className="sortfil">
                <br></br>
                    <label>Sort By: </label>
                    <select value={this.state.sortBy} onChange={this.handleSortChange}>
                        <option value="none">None</option>
                        <option value="priority">Priority</option>
                        <option value="dueDate">Due Date</option>
                    </select>
                <br></br>
                <br></br>
                    <label>Filter By Category: </label>
                    <input
                        type="text"
                        value={this.state.filterByCategory}
                        onChange={this.handleFilterChange}
                        placeholder="Category"
                    />
                </div>
                <ul>
                    {tasks.map(task => (
                        <li key={task.id} className={task.completed ? 'completed' : ''}>
                            <span>
                                {task.title} , {task.priority} priority , {task.category} , Due Date: {task.dueDate}
                            </span>
                            <div>
                                <button className="complete" onClick={() => this.toggleComplete(task.id)}>
                                    {task.completed ? 'Undo' : 'Complete'}
                                </button>
                                <button className="delete" onClick={() => this.deleteTask(task.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));



