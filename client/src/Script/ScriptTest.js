
const h1 = React.createElement('h1', null, 'Hello World')
const container = document.getElementById('content')
const title = React.createElement('h1', null, 'ToDo List')



class Task extends React.Component{

    constructor(){
        super();
        this.edit = this.edit.bind(this);
        this.remove = this.remove.bind(this);
    }
    

    render() {
        return React.createElement('div', {display : "inline-block"},
            React.createElement('li', null, this.props.title),
            React.createElement( 'input', { type : 'submit', value :"Remove", onClick : this.remove}),
            React.createElement( 'input', { type : 'submit', value :"Edit", onClick : this.edit})
        )
    }

    remove(state) {
        state.items.pop()
    }

    edit (){

    }
}

class TaskForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        this.setState({value : event.target.value})
    }

    handleSubmit(event){
        this.setState((prev) => {
            if(prev.value !== ""){
                this.props.handleSubmit(prev.value);
                return {value : ""}
            }
            return prev
        })
        
    }

    render(){
        return React.createElement('div', null,
            React.createElement( 'input', { name : 'newtask', onChange : this.handleChange, value: this.state.value}),
            React.createElement( 'input', { type : 'submit', value :"Submit b", onClick : this.handleSubmit})
        )
    }
}

class TaskList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            items : props.tasks,
        };

        this.addValue = this.addValue.bind(this);
    }
    
    addValue(value){
        this.setState( prev => {
            const newState = { items: prev.items.map(i => i)};
            newState.items.push(value);
            return newState;
        });        
    }

/*    remove(item) {
        
    }

    edit (item){

    }
*/

    render() {
        return React.createElement ('div', null,
            React.createElement('h2', null, this.props.title),
            React.createElement('ul', null,
                this.state.items.map(t => React.createElement(Task, {title : t, remove : this.state}))),
            React.createElement(TaskForm, {handleSubmit: this.addValue})
        )
    }
}




const tasks = React.createElement(TaskList,
    {
        title : "Task todo",
        tasks : ['buy the milk', 'call Mom']
    }
)

/*
const wip = React.createElement(TaskList,
    {
        title : "WIP",
        tasks : ['project', 'Marketing']
    }
)
*/


//const div = React.createElement('div', null, title, tasks, wip)
const div = React.createElement('div', null, title, tasks)

ReactDOM.render (div, container)

