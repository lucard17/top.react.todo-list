import React from "react";

function ToDoItems({
                       currentList,
                       props,
                   }) {

    return currentList.map(
        (item, index) => ToDoItem({
            ...item,
            index,
            props,
        })
    )
}

function ToDoItem({
                      text,
                      done,
                      id,
                      index,
                      props: {
                          onEditIndex,
                          onEditText,
                          onInput,
                          edit,
                          changeState
                      }
                  }) {
    return <div className={"todo-list__item" + (done ? " done" : "")} key={id}>
        <input
            type='text'
            className={'todo-list__input'}
            onInput={event => onInput(event)}
            value={index === onEditIndex ? onEditText : text}
            disabled={index !== onEditIndex}
        />
        <button
            className={'todo-list__edit-button' + (index === onEditIndex ? ' active' : '')}
            disabled={(onEditIndex !== undefined && onEditIndex !== index) || done}
            onClick={() => edit(index)}
        >
            <i className="fa-solid fa-pen"></i>
        </button>
        <button className={'todo-list__state-button'}
                onClick={() => changeState(index)}
                disabled={onEditIndex !== undefined}
        >
            <i className={"fa-solid" + (done ? " fa-xmark" : " fa-check")}></i>
        </button>
    </div>
}

export default ToDoItems