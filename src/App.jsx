import React, {Component} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Venue from './Venue.jsx';
import './App.css';

var clientId= 'FSXQIM5TAZJAZRDJHDOHVLUGVSV0KOV5BPVK2YC43ML4MEHM';
var clientSecret ='QV1AZICUPSBZRA5XD5MAOMYWDTEZ45BZEPD4SY12U0ZZ4GVQ';
var key = '?client_id='+ clientId + '&client_secret='+ clientSecret  + '&v=20190808'; //Kiko, base url - question mark - $


class App extends Component {
  constructor(props){
    super(props)
    this.state={
      venues:[
        // {
        //   id: "4bc992e7b6c49c7401a28e91", 
        //   name: "Ken Yakitori", 
        //   address: ["89 Karangahape Rd.","Auckland 1010","New Zealand" ],
        //   category: "Japanese"
        // },
        // {
        //   id: "4b4d4133f964a52070cf26e3", 
        //   name: "Real Groovy", 
        //   address: ["369 Queen Street","Auckland 1010","New Zealand"], 
        //   category: "Record Shop"
        // },
        // {
        //   id: "4b53a56bf964a52013a627e3", 
        //   name: "Revel! Cafe", 
        //   address: ["146 Karangahape Rd (btwn Queen St & Mercury Ln)", "Auckland 1010", "New Zealand"],
        //   category: "Café"
        // }

        //Kiko, because we have import the life data via FourSquare API, therefore we don't need to set any state as above.
      ],
      isModalOpen: false,

      watchVenue:null

    };
  }

  loadVenues = ()=>{

      var latlng = '-36.857044,174.764406';

      var venuesURL='https://api.foursquare.com/v2/venues/explore'+key +'&ll='+latlng;
      fetch(venuesURL)
          .then(res=>res.json()) //Kiko, oneline method

          .then((data)=>{
              return data.response.groups[0].items
          })
          .then((data)=>{
              return data.map((item)=>{
                  var venue = {
                      id:item.venue.id,
                      icon:item.venue.categories[0].icon,
                      name: item.venue.name,
                      address:item.venue.location.formattedAddress,
                      category: item.venue.categories[0].shortName
                  
                  };
                  return venue;
              })
          })
          .then((data)=>{
              // console.log(data);
              this.setState({venues:data})
          })  
  }

  loadVenue = (venueId) => {
    this.setState({watchVenue:null});
    //get details off 1 venue
    var venueURL = 'https://api.foursquare.com/v2/venues/' + venueId + key;

    fetch(venueURL)
        .then(res=>res.json()) 

        .then((data)=>{
            var item = data.response.venue;

            var venue={
                name:item.name,
                description:item.description,
                category:item.categories[0].name,
                address:item.location.formattedAddress,
                photo:item.bestPhoto.prefix + '300x300'+ item.bestPhoto.suffix

            }
            this.setState({watchVenue:venue})
            // console.log(venue);
        })
   
}

  //Kiko, this is special function, the App will call it, not us calling it. 
  componentDidMount(){
    this.loadVenues();
  }

  openModal = ()=>{
    this.setState({isModalOpen:true})
  }

  closeModal = ()=>{
    this.setState({isModalOpen:false})
  }


  render(){
    return(
      <div className="app">
      <div className="container">
        <div className="venues">
          {
            this.state.venues.map((venue)=>{

              var venueProps = {
                ...venue, 
                key: venue.id,
                openModal:this.openModal,
                loadVenue:this.loadVenue
              };

              return( <Venue {...venueProps}/>)
            })
          }

        </div> 

        <div className="venue-filters">
          
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <div role="group" className="btn-group btn-group-toggle">
              <label className="venue-filter btn active btn-primary">
                <input name="venue-filter" type="radio" autoComplete="off" value="all" />All
              </label>
              <label className="venue-filter btn btn-primary">
                <input name="venue-filter" type="radio" autoComplete="off" value="food"/>Food
              </label>
              <label className="venue-filter btn btn-primary">
                <input name="venue-filter" type="radio" autoComplete="off" value="drinks"/>Drinks
              </label>
              <label className="venue-filter btn btn-primary">
                <input name="venue-filter" type="radio" autoComplete="off" value="others"/>Others
              </label>
            </div>
          </div>
        </div>
      </div>


        <Modal show={this.state.isModalOpen} onHide={()=>this.closeModal()}>
          
          <Modal.Body>
            {
                  this.state.watchVenue !== null? (
                    <div className="venue-popup-body row">
                      <div className="col-6">
                        <h1 className="venue-name">{this.state.watchVenue.name}</h1>
                        <p>{this.state.watchVenue.description}</p>
                        <p>{this.state.watchVenue.address[0]}</p>
                        <p>{this.state.watchVenue.address[1]}</p>
                        <p><span className="badge venue-type">{this.state.watchVenue.category}</span></p>
                      </div>
                      <div className="col-6">
                        <img src={this.state.watchVenue.photo} className="img-fluid" alt="Responsive" />
                      </div>
                    </div>

                  ):'Loading...'
                }
            
          </Modal.Body>
          
        </Modal>
      {/* <div className="modal" id="venue-modal" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
     
            <div className="modal-body">

      

            </div>

          </div>
        </div>
      </div> */}
    </div>

    )
  }
}

export default App;
