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
import "./calendar-styles.css";
import SchedgeLogo from './Schedge-Logo.svg';

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
        modalIsOpen: false,
        newTitle: '',
        newTeacher: '',
        newRoom: '',
        start: '',
        end: ''
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
      return events.indexOf(existingEvent) === events.indexOf(event)
        ? { ...existingEvent, start, end }
        : existingEvent;
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

  newEvent = ({start, end}) => {
    this.setState({
      modalIsOpen: true,
      start: start,
      end: end
    })
  }

  addEvent = () => {
    const { title, start, end, newRoom, newTeacher} = this.state;
    this.setState({
      events: [
        ...this.state.events,
        {
          title,
          start,
          end,
          room: newRoom,
          teacher: newTeacher,
        },
      ],
      newTeacher: '',
      newTitle: '',
      newRoom: ''
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
      events: [],
      roomOptions: [],
      teacherOptions: []
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

  handleInputChange = (e) =>{
    const key = e.target.name;
    let newState = this.state[key];
    newState = e.target.value;
    this.setState({ [key]: newState });
  }

  render() {
    console.log(this.state);
    const { roomOptions, teacherOptions, selectedRoom, selectedTeacher, events, specificEvents } = this.state;
    return (
      <div className="App">
        <div className="sidebar">
        <div className="top">
          <div className="logo">
            <img className="logo-image" src={SchedgeLogo} alt="schedge logo"></img>
          </div>
          <div className="classroom">
            <Select
              placeholder="Select Room"
              value={selectedRoom}
              onChange={this.handleRoomChange}
              options={roomOptions}
              isMulti
            />
          </div>
          <div className="teacher">
            <Select
              placeholder="Select Teacher"
              value={selectedTeacher}
              onChange={this.handleTeacherChange}
              options={teacherOptions}
              isMulti
            />
          </div>
          </div>
          <div className="sidebar-buttons">
          <button className="load-btn btn" onClick={this.loadEvents}>Load Events</button>
          <button className="reset-btn btn" onClick={this.loadEvents}>Reset</button>
          <button className="clear-btn btn" onClick={this.clearEvents}>Clear</button>
        </div>
        </div>
        <DnDCalendar
          selectable
          defaultDate={new Date('2019, 4, 10, 06:00')}
          defaultView="week"
          events={specificEvents === '' ? events : specificEvents}
          onEventDrop={this.moveEvent}
          onEventResize={this.resizeEvent}
          resizable
          style={{ height: "100vh", width: "100%" }}
          localizer={localizer}
          min={new Date('2019, 3, 7, 06:00')}
          max={new Date('2019, 3, 13, 23:00')}
          onSelectEvent={event => console.log(events.indexOf(event))}
          onSelectSlot={this.newEvent}
          step={15}
        />

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          ariaHideApp={false}
          className="add-modal"
          overlayClassName="add-modal-overlay"
        >
          <div className="add-modal-body">
            <div className="add-modal-header">
              <h2 ref={subtitle => this.subtitle = subtitle}>Add Event</h2>
              <button onClick={this.closeModal}>X</button>
            </div>
            <input className="input" placeholder="Title"  name="newTitle" value={this.state.newTitle} onChange={ e => {this.handleInputChange(e) }}/>
            <input className="input" placeholder="Teacher" name="newTeacher" value={this.state.newTeacher} onChange={ e => {this.handleInputChange(e) }}/>
            <input className="input" placeholder="Room" name="newRoom" value={this.state.newRoom} onChange={ e => {this.handleInputChange(e) }}/>
            <button className="add-btn" onClick={this.addEvent}>Add</button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
