var $ = jQuery = require('jquery');
var _ = require('lodash');
var bootstrap = require('bootstrap');
var fs = eRequire('fs');
var loadApts = JSON.parse(fs.readFileSync(dataLocation));

var electron = eRequire('electron');
var ipc = electron.ipcRenderer;

var React = require('react');
var ReactDOM = require('react-dom');
var AptList = require('./AptList');
var Toolbar = require('./Toolbar');
var AddAppointment = require('./AddAppointment');
var HeaderNav = require('./HeaderNav');

var MainInterface = React.createClass({
  getInitialState: function() {
    return {
        aptBodyVisible: false,
        queryText: '',
        orderBy: 'petName',
        orderDir: 'asc',
        myAppointments: loadApts
    }//return
  }, //getInitialState

  componentDidMount: function() {
    ipc.on('addAppointment', function(event, message) {
      this.toggleAptDisplay();
    }.bind(this));
  },

  componentWillUnMount: function() {
    ipc.removeListener('addAppointment', function(event, message) {
      this.toggleAptDisplay();
    }.bind(this));
  },

  componentDidUpdate: function() {
    fs.writeFile(dataLocation, JSON.stringify(this.state.myAppointments), 'utf8', function(err) {
      if (err) {
        console.log(err);
      }
    });//writeFile
  }, //componentDidUpdate

  showAbout: function() {
    ipc.sendSync('openInfoWindow');
  },

  toggleAptDisplay: function() {
    var tempVisibility = !this.state.aptBodyVisible;
    this.setState({
        aptBodyVisible : tempVisibility
    });
  },

  addItem: function(tempItem) {
    var tempApts = this.state.myAppointments;
    tempApts.push(tempItem);
    this.setState({
        myAppointments: tempApts,
        aptBodyVisible: false,
    })
  },

  deleteMessage: function(item) {
    var allApts = this.state.myAppointments;
    var newApts = _.without(allApts, item);
    this.setState({
      myAppointments: newApts
    }); //setState
  }, //deleteMessage

  reOrder: function(orderBy, orderDir){
    this.setState({
      orderBy: orderBy,
      orderDir: orderDir
    })
  },

  searchApts:function(query){
    this.setState({
      queryText: query
    });
  },

  render: function() {
    var filterApts = [];
    var queryText = this.state.queryText;
    var orderBy = this.state.orderBy;
    var orderDir = this.state.orderDir;
    var myAppointments = this.state.myAppointments;

    if(this.state.aptBodyVisible === true) {
        $('#addAppointment').modal('show');
    } else {
        $('#addAppointment').modal('hide');
    }

    for (var i = 0; i < myAppointments.length; i++) {
      if(
        (myAppointments[i].petName.toLowerCase().indexOf(queryText) != -1) ||
        (myAppointments[i].ownerName.toLowerCase().indexOf(queryText) != -1) ||
        (myAppointments[i].aptDate.toLowerCase().indexOf(queryText) != -1) ||
        (myAppointments[i].aptNotes.toLowerCase().indexOf(queryText) != -1)
      ) {
        filterApts.push(myAppointments[i]);
      }
    }

    filterApts = _.orderBy(filterApts, function(item) {
      return item[orderBy].toLowerCase();
    }, orderDir);

    filterApts=filterApts.map(function(item, index) {
      return(
        <AptList key = {index}
          singleItem = {item}
          whichItem =  {item}
          onDelete = {this.deleteMessage}
        />
      ) // return
    }.bind(this)); //Appointments.map
    return(
      <div className="application">
        <HeaderNav
            orderBy = {this.state.orderBy}
            orderDir = {this.state.orderDir}
            onSearch = {this.searchApts}
            onReOrder = {this.reOrder}
        />
        <div className="interface">    
            <Toolbar
                handleAbout = {this.showAbout}
                handleToggle = {this.toggleAptDisplay}
            />
            <AddAppointment
                handleToggle = {this.toggleAptDisplay}
                addApt = {this.addItem}
            />
            <div className="container">
                <div className="row">
                    <div className="appointments col-sm-12">
                        <h2 className="appointments-headline">Current Appointments</h2>
                        <ul className="item-list media-list">{filterApts}</ul>
                    </div>{/* col-sm-12 */}
                </div>{/* row */}
            </div>
        </div>{/* container */}
      </div>
    );
  } //render
});//MainInterface

ReactDOM.render(
  <MainInterface />,
  document.getElementById('petAppointments')
); //render