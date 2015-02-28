/** @jsx React.DOM */
var ALL_Tasks = 'All',
	ACTIVE_Tasks = 'Active',
	COMPLETED_Tasks = 'Completed';
var ENTER_KEY_CODE = 13;

var Tasks = {};
var TabName = ALL_Tasks;

function addItem(text){
	var id = Math.random().toString(36).substring(2);
	Tasks[id] = {
		id: id,
		complete: false,
		content: text,
	};
}

function updateItem(id, text){
	Tasks[id].content = text;
}

function removeItem(id){
	delete Tasks[id];
}

function isComplete(id, status){
	Tasks[id].complete = status;
}

function allComplete(status){
	for(var k in Tasks){
		Tasks[k].complete = status;
	}
}

var taskNum = function(){
	var n = 0;
	for(var k in Tasks){
		if(Tasks.hasOwnProperty(k)) n++
	}
	return n;
};

var TodoInput = React.createClass({
	getInitialState: function(){
		return {
			value: this.props.value || ''
		}
	},
	onChange: function(event){
		this.setState({
			value: event.target.value
		})
	},
	save: function(){
		this.props.onSave(this.state.value);
		this.setState({value:''})
	},
	onKeyDown: function(event){
		if(event.keyCode === ENTER_KEY_CODE){
			this.save();
		}
	},
	render: function(){
		return (
			<input
				placeholder={this.props.placeholder}
				onKeyDown={this.onKeyDown}
				value={this.state.value}
				onChange={this.onChange}
				onBlur={this.save}
				autoFocus={true} />
		)
	}
});

var TodoHeader = React.createClass({
	create: function(text){
		if(text.trim()){
			addItem(text);
			this.props.onChange();
		}
	},
	updateComplete: function(){
		allComplete(this.refs.all.getDOMNode().checked);
		this.props.onChange();
	},
	render: function(){
		var showAllSelect = taskNum() > 0 ? true : false;
		var allCheck = (function(){
			for(var k in Tasks){
				if(!Tasks[k].complete){
					return false;
				}
			}
			return true;
		})();

		var allInput;
		if(showAllSelect){
			allInput = (
				<input
					type="checkbox"
					onChange={this.updateComplete}
					checked={allCheck}
					ref="all"
				/>
			)
		}
		return (
			<header>
				<h1>Todos</h1>
				{allInput}
				<TodoInput placeholder="what needs to be done" onSave={this.create} />
			</header>
		)
	}
});

var TaskItem = React.createClass({
	getInitialState: function(){
		return {
			isEditing: false
		}
	},
	doubleClick: function(){
		this.setState({isEditing:true});
	},
	updateComplete: function(){
		isComplete(this.props.task.id, !this.props.task.complete);
		this.props.onChange();
	},
	removeTask: function(){
		removeItem(this.props.task.id);
		this.props.onChange();
	},
	onSave: function(text){
		if(text.trim()){
			updateItem(this.props.task.id, text);
		}
		this.setState({isEditing:false});
	},
	render: function(){
		var item = this.props.task;
		var input;
		if (this.state.isEditing) {
	      input =
	        <TodoInput value={this.props.task.content} onSave={this.onSave} />;
	    }
		return (
			<li className={classNames({'completed': item.complete === true, 'editing': this.state.isEditing})}>
				<div className="itembox">
					<input
						type="checkbox"
						onChange={this.updateComplete}
						checked={item.complete}
						ref="checkbox"
					/>
					<span onDoubleClick={this.doubleClick}>
						{item.content}
					</span>&nbsp;
					<a href='javascript:;' onClick={this.removeTask}>x</a>
				</div>
				{input}
			</li>
		)
	}
});


var TodoSection = React.createClass({
	render: function(){
		var index = this.props.tabIndex;
		var lists = {
			All: [],
			Active: [],
			Completed: []
		};
		var items;
		for(var k in Tasks){
			if(Tasks[k].complete){
				lists.Completed.push(<TaskItem onChange={this.props.onChange} task={Tasks[k]} />);
			}else{
				lists.Active.push(<TaskItem onChange={this.props.onChange} task={Tasks[k]} />)
			}
			lists.All.push(<TaskItem onChange={this.props.onChange} task={Tasks[k]} />)
		}

		items = lists[index];
		return <section>{items}</section>
	}
});


var TodoFooter = React.createClass({
	handleClick: function(event){
		TabName = event.target.innerHTML;
		this.props.tabChange();
	},
	render: function(){
		var current = this.props.tabIndex;
		var num = taskNum();
		return (
			<footer>
				<span>{num} {num>1?'items':'item'} left</span>&nbsp;
				<a className={classNames({'active': current === ALL_Tasks})} href="javascript:;" onClick={this.handleClick}>All</a>&nbsp;
				<a className={classNames({'active': current === ACTIVE_Tasks})} href="javascript:;" onClick={this.handleClick}>Active</a>&nbsp;
				<a className={classNames({'active': current === COMPLETED_Tasks})} href="javascript:;" onClick={this.handleClick}>Completed</a>
			</footer>
		)
	}
});

var APP = React.createClass({
	getInitialState: function(){
		return {
			items: Tasks,
			tabIndex: TabName
		}
	},
	handleChange: function(){
		this.setState({items:Tasks});
	},
	handleTab: function(){
		this.setState({tabIndex:TabName});
	},
	render: function(){
		return (
			<div>
				<TodoHeader onChange={this.handleChange} />
				<TodoSection onChange={this.handleChange} tabIndex={this.state.tabIndex} />
				<TodoFooter tabChange={this.handleTab} tabIndex={this.state.tabIndex} />
			</div>
		)
	}
});

React.render(<APP />, document.body);