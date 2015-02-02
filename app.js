/** @jsx React.DOM */
var _tasks = [];
var _index = 'All';

function addItem(item){
	_tasks.push(item);
}

function removeItem(index){
	_tasks.splice(index,1);
}

function isComplete(index, status){
	_tasks[index].complete = status;
}

function allComplete(status){
	_tasks.forEach(function(task, i){
		task.complete = status;
	})
}

var Header = React.createClass({
	updateComplete: function(){
		allComplete(this.refs.all.getDOMNode().checked);
		this.props.onChange();
	},
	handleKeyup: function(e){
		if(e.which === 13){
			if(this.refs.task.getDOMNode().value){
				addItem({
					id: _tasks.length + 1,
					content: e.target.value,
					complete: false
				});

				this.props.onChange();

				e.target.value = '';
			}
		}
	},
	render: function(){
		var status = this.props.tasks.length > 0 ? true : false;
		this.props.tasks.forEach(function(task){
			if(task.complete === false){
				status = false;
			}
		});
		return (
			<div>
				<h1>Todos</h1>
				<input type="checkbox" onChange={this.updateComplete} checked={status} ref="all" />
				<input placeholder="what needs to be done" onKeyUp={this.handleKeyup} ref="task" />
			</div>
		)
	}
});

var TaskItem = React.createClass({
	updateComplete: function(){
		isComplete(this.props.index, this.refs.checkbox.getDOMNode().checked);
		this.props.onChange();
	},
	removeTask: function(){
		removeItem(this.props.index);
		this.props.onChange();
	},
	render: function(){
		return (
			<li>
				<input type="checkbox" onChange={this.updateComplete} checked={this.props.status} ref="checkbox" />
				{this.props.children}
				<a href='javascript:;' onClick={this.removeTask}>x</a>
			</li>
		)
	}
});


var Section = React.createClass({
	render: function(){
		var that = this;
		var index = this.props.tabIndex;
		var lists = {
			All: [],
			Active: [],
			Completed: []
		};
		var items;
		this.props.tasks.forEach(function(task, i){
			var taskStyle = task.complete?'completed':'';
			if(task.complete){
				lists.Completed.push(<TaskItem index={i} onChange={that.props.onChange} status={task.complete}><span className={taskStyle}>{task.content}</span></TaskItem>)
			}else{
				lists.Active.push(<TaskItem index={i} onChange={that.props.onChange} status={task.complete}><span>{task.content}</span></TaskItem>)
			}
			lists.All.push(<TaskItem index={i} onChange={that.props.onChange} status={task.complete}><span className={taskStyle}>{task.content}</span></TaskItem>)
		});
		items = lists[index];
		return <div>{items}</div>
	}
});


var Footer = React.createClass({
	handleClick: function(e){
		_index = e.target.innerHTML;
		this.refs.All.getDOMNode().className = '';
		this.refs.Active.getDOMNode().className = '';
		this.refs.Completed.getDOMNode().className = '';
		this.refs[_index].getDOMNode().className = 'active';
		this.props.tabChange();
	},
	render: function(){
		var total = 0;
		this.props.tasks.forEach(function(){
			total += 1;
		})
		return (
			<div>
				<span>{total} {total>1?'items':'item'} left</span>&nbsp;
				<a className="active" href="javascript:;" ref="All" onClick={this.handleClick}>All</a>&nbsp;
				<a href="javascript:;" ref="Active" onClick={this.handleClick}>Active</a>&nbsp;
				<a href="javascript:;" ref="Completed" onClick={this.handleClick}>Completed</a>
			</div>
		)
	}
});

var APP = React.createClass({
	getInitialState: function(){
		return {
			items: _tasks,
			tabIndex: _index
		}
	},
	handleChange: function(){
		this.setState({items:_tasks});
	},
	handleTab: function(){
		this.setState({tabIndex:_index});
	},
	render: function(){
		return (
			<div>
				<Header tasks={this.state.items} onChange={this.handleChange} />
				<Section tasks={this.state.items} onChange={this.handleChange} tabIndex={this.state.tabIndex} />
				<Footer tasks={this.state.items} tabChange={this.handleTab} />
			</div>
		)
	}
});

React.render(<APP />, document.body);