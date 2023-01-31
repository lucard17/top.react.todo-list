import React, {useState} from "react";
import ToDoItems from "./ToDoItems"

function ToDoList() {
    const [text, setText] = useState('')
    const [history, setHistory] = useState([[]])
    const [historyIndex, setHistoryIndex] = useState(1)
    const [onEditIndex, setOnEditIndex] = useState(undefined);
    const [onEditText, setOnEditText] = useState('');

    function getCurrentList() {
        return history[historyIndex - 1].map(item => Object.assign({}, item));
    }

    function updateHistory(item) {
        const actualHistory = [...history.slice(0, historyIndex), item];

        setHistory(actualHistory);
        setHistoryIndex(actualHistory.length);

    }

    function itemOnInput(event) {
        setOnEditText(event.target.value);
    }

    function itemEdit(index) {
        const currentList = getCurrentList();
        if (onEditIndex === undefined) {
            setOnEditIndex(index)
            setOnEditText(currentList[index].text)
        } else {
            if (currentList[index].text !== onEditText) {
                currentList[index].text = onEditText;
                updateHistory(currentList);
            }
            ;
            setOnEditIndex(undefined);
            setOnEditText('');
        }
    }

    function itemChangeState(index) {
        const currentList = getCurrentList();
        if (currentList[index].done) {
            removeItem({array: currentList, index})
        } else {
            moveItemToEnd({array: currentList, index})
        }
        updateHistory(currentList);

    }

    function addItem() {
        const currentList = [{
            text: text,
            id: Date.now(),
            done: false,
        }, ...getCurrentList()]
        updateHistory(currentList);
        setText('');
    }

    function moveItemToEnd({array, index}) {
        const temp = array.splice(index, 1)[0];
        temp.done = true;
        array.push(temp);
    }

    function removeItem({array, index}) {
        array.splice(index, 1);
    }

    return <>
        <div className={'todo-app'}>
            <div className={'todo-list'}>
                {ToDoItems({
                    currentList: history[historyIndex - 1],
                    props:{onEditIndex,
                    onEditText,
                    onInput: itemOnInput,
                    edit: itemEdit,
                    changeState: itemChangeState,}
                })}
            </div>
            <div className={'inputForm'}>
                <input
                    className={'inputForm__input'}
                    onInput={(event) => {
                        setText(event.target.value)
                    }}
                    type='text'
                    value={text}
                    disabled={onEditIndex !== undefined}
                    placeholder={'Enter the text!)'}/>

                <button
                    className={'inputForm__button inputForm__button_add'}
                    onClick={() => addItem()}
                    disabled={text === "" || onEditIndex !== undefined}
                >
                    <i className="fa-solid fa-plus"></i>
                </button>

                <div className={'inputForm__br'}></div>
                <button className={'inputForm__button inputForm__button_undo'}
                        onClick={() => setHistoryIndex(old => old - 1)}
                        disabled={historyIndex === 1 || onEditIndex !== undefined}
                >
                    <i className="fa-solid fa-arrow-rotate-left"></i>
                </button>
                <button className={'inputForm__button inputForm__button_redo'}
                        onClick={() => setHistoryIndex(old => old + 1)}
                        disabled={historyIndex === history.length || onEditIndex !== undefined}

                ><i
                    className="fa-solid fa-arrow-rotate-right"></i></button>

            </div>
        </div>
    </>
}

export default ToDoList

