import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// ========================================

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            onEditIndex: undefined,
            history: [[]],
            historyIndex: 1,
        }
    }

    handleAddItemOnInput = (event) => {
        this.setState({text: event.target.value});
    }

    handleAddItemButtonClick = () => {
        const todoListCurrent = this.state.history[this.state.historyIndex - 1];
        console.log('btn-clicked');
        const currentTodoListCopy = [{
            text: this.state.text,
            id: Date.now(),
            done: false,
            onEdit: false,
        }].concat(todoListCurrent);

        const {actualHistoryCopy} = this.getCopies()
        actualHistoryCopy.push(currentTodoListCopy)
        this.setState({
            text:'',
            history: actualHistoryCopy,
            historyIndex: actualHistoryCopy.length,
        });
    }

    handleButtonUndo = () => {
        this.setState({
            historyIndex: (this.state.historyIndex > 0 ? this.state.historyIndex - 1 : 0),
        })
    }

    handleButtonRedo = () => {
        this.setState({
            historyIndex: (this.state.historyIndex < this.state.history.length ? this.state.historyIndex + 1 : this.state.historyIndex),
        })

    }

    handleItemOnInput = (event) => {
        const index = this.state.onEditIndex;
        const {actualHistoryCopy, currentTodoListCopy} = this.getCopies()
        currentTodoListCopy[index].text = event.target.value;
        actualHistoryCopy.splice(-1, 1, currentTodoListCopy);
        this.setState({
            history: actualHistoryCopy,
            historyIndex: actualHistoryCopy.length,
        })
    }
    //внизу конечно тазик со спагетти, но я правда старался
    handleItemButtonEdit = (id) => {
        const {actualHistoryCopy, currentTodoListCopy} = this.getCopies()

        const index = currentTodoListCopy.findIndex((i) => {
            if (i.id === id) return true;
        });
        let onEditIndex = this.state.onEditIndex;

        const indexItem = currentTodoListCopy[index];
        const onEditItem = currentTodoListCopy[onEditIndex];

        if (onEditIndex === undefined) {
            onEditIndex = index;
            indexItem.prevText = indexItem.text;
            actualHistoryCopy.splice(-1, 1, currentTodoListCopy);
            this.setState({
                onEditIndex: onEditIndex,
                history: actualHistoryCopy,
                historyIndex: actualHistoryCopy.length,
            });
        } else {
            if (onEditItem.prevText !== onEditItem.text) {
                actualHistoryCopy[actualHistoryCopy.length - 1][onEditIndex].text = actualHistoryCopy[actualHistoryCopy.length - 1][onEditIndex].prevText;
                delete actualHistoryCopy[actualHistoryCopy.length - 1][onEditIndex].prevText;
                delete onEditItem.prevText;
                actualHistoryCopy.push(currentTodoListCopy);
            } else {
                delete actualHistoryCopy[actualHistoryCopy.length - 1][onEditIndex].prevText;
            }
            onEditIndex === index ? onEditIndex = undefined : onEditIndex = index;
            actualHistoryCopy[actualHistoryCopy.length - 1][index].prevText = actualHistoryCopy[actualHistoryCopy.length - 1][index].text;

            this.setState({
                onEditIndex: onEditIndex,
                history: actualHistoryCopy,
                historyIndex: actualHistoryCopy.length,
            });
        }
    }
    handleItemButtonState = (id) => {

        const {actualHistoryCopy, currentTodoListCopy} = this.getCopies()
        const index = currentTodoListCopy.findIndex((i) => {
            if (i.id === id) return true;
        })
        if (currentTodoListCopy[index].done) {
            currentTodoListCopy.splice(index, 1);
        } else {
            const temp = currentTodoListCopy[index];
            temp.done = true;
            currentTodoListCopy.splice(index, 1);
            currentTodoListCopy.push(temp);
        }
        actualHistoryCopy.push((currentTodoListCopy))
        this.setState({
            history: actualHistoryCopy,
            historyIndex: actualHistoryCopy.length,
        });
    }
    getCopies = () => {
        const todoListCurrent = this.state.history[this.state.historyIndex - 1];
        return {
            actualHistoryCopy: this.state.history.slice(0, this.state.historyIndex),
            currentTodoListCopy: todoListCurrent.map(
                item => Object.assign({}, item)
            )
        }
    }

    ToDoItem = ({text, done, id}, index) => {
        return <div className={"todo-list__item" + (done ? " done" : "")} key={id}>
            <input
                type='text'
                className={'todo-list__input'}
                onInput={this.handleItemOnInput}
                value={text}
                disabled={index !== this.state.onEditIndex}
            />
            <button
                className={'todo-list__edit-button' + (index === this.state.onEditIndex ? ' active' : '')}
                disabled={done}
                onClick={() => this.handleItemButtonEdit(id, 'textEdit')}
            >
                <i className="fa-solid fa-pen"></i>
            </button>
            <button className={'todo-list__state-button'}
                    onClick={() => this.handleItemButtonState(id, 'changeState')}
            >
                <i className={"fa-solid" + (done ? " fa-xmark" : " fa-check")}></i>
            </button>
        </div>
    }

    render() {
        let listItems = this.state.history[this.state.historyIndex - 1].map(
            (item, index) => this.ToDoItem(item, index)
        )
        return <div className={'todo-app'}>
            <div className={'todo-list'}>
                {listItems}
            </div>
            <div className={'inputForm'}>
                <input
                    className={'inputForm__input'}
                    onInput={this.handleAddItemOnInput}
                    type='text'
                    value={this.state.text} placeholder={'Enter the text!)'}/>
                <button
                    className={'inputForm__button inputForm__button_add'}
                    onClick={this.handleAddItemButtonClick}
                    disabled={this.state.text===""}>
                    <i className="fa-solid fa-plus"></i>
                </button>

                <div className={'inputForm__br'}></div>
                <button className={'inputForm__button inputForm__button_undo'}
                        onClick={this.handleButtonUndo}
                        disabled={this.state.historyIndex === 1 || this.state.onEditIndex !== undefined}
                >
                    <i className="fa-solid fa-arrow-rotate-left"></i>
                </button>
                <button className={'inputForm__button inputForm__button_redo'}
                        onClick={this.handleButtonRedo}
                        disabled={this.state.historyIndex === this.state.history.length || this.state.onEditIndex !== undefined}

                ><i
                    className="fa-solid fa-arrow-rotate-right"></i></button>

            </div>
        </div>

    }

}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App></App>);

// ========================================


// function getRandomColor() {
//     return `rgb(${getRandomInt(0, 125)}, ${getRandomInt(0, 125)}, ${getRandomInt(0, 125)})`
// }
//
// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }