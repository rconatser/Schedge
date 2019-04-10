import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import events from './events';

import "./App.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = BigCalendar.momentLocalizer(moment);

const DnDCalendar = withDragAndDrop(BigCalendar);

class App extends Component {
    constructor(props){
      super(props);
      this.state = {
        events: events
    }
    this.resizeEvent = this.resizeEvent.bind(this);
    this.moveEvent = this.moveEvent.bind(this);
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

  render() {
    console.log(this.state.events);
    return (
      <div className="App">
        <div className="sidebar">
          <div className="logo">
            <h2>Schedge&nbsp;<i className="far fa-calendar-alt"></i></h2>
          </div>
          <div className="classroom">
            <h3>Classroom</h3>
            <div>
              <input name="classroom" type="radio" value="406"/>
              <label htmlFor="406">&nbsp;406</label>
            </div>
            <div>
              <input name="classroom" type="radio" value="512"/>
              <label htmlFor="512">&nbsp;512</label>
            </div>
            <div>
              <input name="classroom" type="radio" value="626"/>
              <label htmlFor="626">&nbsp;626</label>
            </div>
          </div>
          <div className="teacher">
            <h3>Teacher</h3>
            <div>
              <input name="teacher" type="radio" value="Harper"/>
              <label htmlFor="Harper">&nbsp;Harper</label>
            </div>
            <div>
              <input name="teacher" type="radio" value="Hatch"/>
              <label htmlFor="Hatch">&nbsp;Hatch</label>
            </div>
            <div>
              <input name="teacher" type="radio" value="Christensen"/>
              <label htmlFor="Christensen">&nbsp;Christensen</label>
            </div>
          </div>
        </div>
        <DnDCalendar
          selectable
          defaultDate={new Date()}
          defaultView="week"
          events={this.state.events}
          onEventDrop={this.moveEvent}
          onEventResize={this.resizeEvent}
          resizable
          style={{ height: "100vh", width: "100%" }}
          localizer={localizer}
          min={new Date('2019, 3, 7, 06:00')}
          max={new Date('2019, 3, 13, 23:00')}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={this.handleSelect}
          step={15}
        />
      </div>
    );
  }
}

export default App;
