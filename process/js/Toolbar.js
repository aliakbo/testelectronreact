var React = require('react');

var Toolbar = React.createClass({
    toggleAbout: function() {
        this.props.handleAbout();
    },
    createAppointment: function() {
        this.props.handleToggle();
    },
    render: function() {
        return(
          <div className="toolbar">
            <div className="toolbar-item" onClick={this.createAppointment}>
              <span className="toolbar-item-button glyphicon glyphicon-plus-sign"></span>
              <span className="toolbar-item-text">Add Appointment</span>
            </div>
            <div className="toolbar-item" onClick={this.toggleAbout}>
              <span className="toolbar-item-button glyphicon glyphicon-question-sign"></span>
              <span className="toolbar-item-text">About this app</span>
            </div>
          </div>
        ) //return
      } //render
});

module.exports = Toolbar;