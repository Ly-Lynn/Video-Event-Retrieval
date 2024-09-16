import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

// import { ListManager } from "react-beautiful-dnd-grid";

import { chunkArray } from "./DargAndDropUtil";

const grid = 2;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  maxWidth: "220px",
  minWidth: "60px",
  whiteSpace: "nowrap",
  overflow: "hidden",

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",
  padding: "10px",
  margin: "0 10px 10px 0",
  border: "1px solid grey",
  // styles we need to apply on draggables
  ...draggableStyle,
  textOverflow: "ellipsis"
});

const getListWrapperStyle = (isDraggingOver, isOpen) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  minHeight: "0.5px",
  display: "flex",
  width: "100%",
  visibility: isOpen | isDraggingOver ? "visible" : "hidden",
  overflowX: "hidden"
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  paddingBottom: 0,
  display: "flex",
  width: "100%"
});

export default class Cards extends React.Component {
  state = {
    isOpen: false,
    maxWidth: null
  };

  openSection = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  componentDidMount() {
    this.setState({
      maxWidth: document.getElementById("SectionsContainer").clientWidth
    });
  }

  isDraggingOnToSection = false;

  isDragged = (isDraggingOver) => {
    console.log("isDraggingOver", isDraggingOver);
    this.isDraggingOnToSection = isDraggingOver;
  };

  renderDraggable(item, index) {
    return (
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <div style={{ display: "flex" }}>
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
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }

  render() {
    const cardsData = chunkArray(this.props.cards, this.state.maxWidth);

    return (
      <>
        {cardsData.length > 0 ? (
          <>
            <button
              onClick={this.openSection}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px"
              }}
            >
              {this.state.isOpen ? "close" : "open"}
            </button>
            {cardsData.map((cards, index) => (
              <Droppable
                droppableId={`${this.props.type}-${index}`}
                type={`droppableSubItem`}
                direction={"horizontal"}
                key={`${this.props.type}-${index}`}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListWrapperStyle(
                      snapshot.isDraggingOver,
                      this.state.isOpen
                    )}
                  >
                    {this.isDragged(snapshot.isDraggingOver)}
                    <div
                      style={
                        this.state.isOpen || this.isDraggingOnToSection
                          ? { display: "flex", width: "100%" }
                          : { display: "none" }
                      }
                    >
                      <div
                        style={getListStyle(snapshot.isDraggingOver)}
                        id="cardsContainer"
                      >
                        {cards.map((item, index) =>
                          this.renderDraggable(item, index)
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </>
        ) : (
          <Droppable
            droppableId={`${this.props.type}-0`}
            type={`droppableSubItem`}
            direction={"horizontal"}
            key={`${this.props.type}-0`}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                id="cardsContainer"
              />
            )}
          </Droppable>
        )}
      </>
    );
  }
}
