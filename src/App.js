import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import allEvents from './events';
import Select from 'react-select';
import Modal from 'react-modal';

import "./App.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = BigCalendar.momentLocalizer(moment);

const DnDCalendar = withDragAndDrop(BigCalendar);

class App extends Component {
    constructor(props){
      super(props);
      this.state = {
        events: [],
        specificEvents: '',
        roomOptions: [],
        teacherOptions: [],
        selectedRoom: '',
        selectedTeacher: '',
        modalIsOpen: false
    }
    this.resizeEvent = this.resizeEvent.bind(this);
    this.moveEvent = this.moveEvent.bind(this);
    this.loadEvents = this.loadEvents.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleTeacherChange = this.handleTeacherChange.bind(this);
  };

  moveEvent ({ event, start, end, allDay }){
    const { events } = this.state;
    const idx = events.indexOf(event);
    const updatedEvent = { ...event, start, end, allDay };
    const nextEvents = [ ...events ];
    nextEvents.splice(idx, 1, updatedEvent);
    this.setState({
      events: nextEvents,
    });
  };

  resizeEvent ({ event, start, end }){
    const { events } = this.state;
    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id ? { ...existingEvent, start, end } : existingEvent;
    });

    this.setState({
      events: nextEvents,
    });
  };

  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  handleSelect = ({ start, end }) => {
    const title = window.prompt('New Event name')
    if (title)
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title,
          },
        ],
      })
  }

  loadEvents() {
    let roomsArray = [ ...new Set(allEvents.map(event => event.room)) ];
    let teachersArray = [ ...new Set(allEvents.map(event => event.teacher)) ];
    let rooms = [];
    let teachers = [];
    for(let i = 0; i < roomsArray.length; i++){
      rooms.push({value: roomsArray[i], label: roomsArray[i]});
    }
    for(let i = 0; i < teachersArray.length; i++) {
      teachers.push({value: teachersArray[i], label: teachersArray[i]});
    }
    this.setState({
      events: allEvents,
      specificEvents: '',
      roomOptions: rooms,
      teacherOptions: teachers,
      selectedRoom: '',
      selectedTeacher: ''
    })
  }

  clearEvents = () => {
    this.setState({
      events: []
    })
  }

  handleRoomChange(selectedRoom) {
    let everyEvent = this.state.events;
    let newEvents = everyEvent.filter(event => event.room === selectedRoom.value);
    this.setState({
      specificEvents: newEvents,
      selectedRoom
    })
  }

  handleTeacherChange(selectedTeacher) {
    let everyEvent = this.state.events;
    let newEvents = everyEvent.filter(event => event.teacher === selectedTeacher.value);
    this.setState({
      specificEvents: newEvents,
      selectedTeacher
    })
  }

  render() {
    console.log(this.state);
    const { roomOptions, teacherOptions, selectedRoom, selectedTeacher, events, specificEvents } = this.state;
    let modalStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    };
    return (
      <div className="App">
        <div className="sidebar">
          <div className="logo">
            <h2>Schedge&nbsp;<i className="far fa-calendar-alt"></i></h2>
          </div>
          <div className="classroom">
            <Select
              placeholder="Select Room"
              value={selectedRoom}
              onChange={this.handleRoomChange}
              options={roomOptions}
            />
          </div>
          <div className="teacher">
            <Select
              placeholder="Select Teacher"
              value={selectedTeacher}
              onChange={this.handleTeacherChange}
              options={teacherOptions}
            />
          </div>
          <button className="load-btn" onClick={this.loadEvents}>Load Events</button>
          <button className="reset-btn" onClick={this.loadEvents}>Reset</button>
          <button className="clear-btn" onClick={this.clearEvents}>Clear</button>
        </div>
        <DnDCalendar
          selectable
          defaultDate={new Date()}
          defaultView="week"
          events={specificEvents === '' ? events : specificEvents}
          onEventDrop={this.moveEvent}
          onEventResize={this.resizeEvent}
          resizable
          style={{ height: "100vh", width: "100%" }}
          localizer={localizer}
          min={new Date('2019, 3, 7, 06:00')}
          max={new Date('2019, 3, 13, 23:00')}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={this.openModal}
          step={15}
        />

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={modalStyle}
          contentLabel="Example Modal"
          ariaHideApp={false}
          className="modal"
        >
          <div className="modal-body">
            <div className="modal-header">
              <h2 ref={subtitle => this.subtitle = subtitle}>Add Event</h2>
              <button onClick={this.closeModal}>X</button>
            </div>
            <p>I am a modal</p>
            <input placeholder="Title"/>
            <input placeholder="Teacher"/>
            <input placeholder="Room"/>
            <button>Add</button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
