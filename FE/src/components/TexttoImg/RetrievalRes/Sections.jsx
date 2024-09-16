import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Cards from "./Cards.jsx";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",
  minWidth: "150px",
  width: "95%",
  marginLeft: "auto",
  marginRight: "auto",
  overflowX: "hidden",
  position: "relative",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  flex: 1
});

export default class Sections extends Component {
  render() {
    return (
      <Droppable droppableId={this.props.id} type="droppableItem">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {this.props.items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div id="SectionsContainer">
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                      {...provided.dragHandleProps}
                    >
                      {item.content}
                      <Cards cards={item.cards} type={`${item.id}`} />
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}
