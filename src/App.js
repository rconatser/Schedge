import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "./App.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = BigCalendar.momentLocalizer(moment);

const DnDCalendar = withDragAndDrop(BigCalendar);

class App extends Component {
  state = {
    events: [
      {
        start: new Date(),
        end: new Date(moment().add(1, "days")),
        title: "Some title"
      }
    ]
  };

  onEventResize = (type, { event, start, end, allDay }) => {
    this.setState(state => {
      state.events[0].start = start;
      state.events[0].end = end;
      return { events: state.events };
    });
  };

  onEventDrop = ({ event, start, end, allDay }) => {
    this.setState(state => {
      state.events[0].start = start;
      state.events[0].end = end;
      return { events: state.events };
    });
    console.log(start);
  };

  render() {
    console.log(this.state.events[0]);
    return (
      <div className="App">
        <div class="sidebar">
          <div class="logo">
            <h2>Schedge&nbsp;<i class="far fa-calendar-alt"></i></h2>
          </div>
          <div class="classroom">
            <h3>Classroom</h3>
            <div>
              <input name="classroom" type="radio" value="406"/>
              <label for="406">&nbsp;406</label>
            </div>
            <div>
              <input name="classroom" type="radio" value="512"/>
              <label for="512">&nbsp;512</label>
            </div>
            <div>
              <input name="classroom" type="radio" value="626"/>
              <label for="626">&nbsp;626</label>
            </div>
          </div>
          <div class="teacher">
            <h3>Teacher</h3>
            <div>
              <input name="teacher" type="radio" value="Harper"/>
              <label for="Harper">&nbsp;Harper</label>
            </div>
            <div>
              <input name="teacher" type="radio" value="Hatch"/>
              <label for="Hatch">&nbsp;Hatch</label>
            </div>
            <div>
              <input name="teacher" type="radio" value="Christensen"/>
              <label for="Christensen">&nbsp;Christensen</label>
            </div>
          </div>
        </div>
        <DnDCalendar
          defaultDate={new Date()}
          defaultView="week"
          events={this.state.events}
          onEventDrop={this.onEventDrop}
          onEventResize={this.onEventResize}
          resizable
          style={{ height: "100vh", width: "100%" }}
          localizer={localizer}
          min={new Date('2019, 1, 7, 06:00')}
          max={new Date('2019, 1, 7, 23:00')}
        />
      </div>
    );
  }
}

export default App;
