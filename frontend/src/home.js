import React, { Component } from "react";
import axios from 'axios';
import './home.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Button from "react-bootstrap/Button";
import { Checkbox } from "@material-ui/core";

import {Map, Marker, GoogleApiWrapper, Circle} from 'google-maps-react';
import { grey } from "@material-ui/core/colors";
const style = {
    width: '100%',
    height: '585px'
  }
const Picture = ({ data }) => <img style={{width:'90%',height:'90%', margin:'auto', 'margin-top':'20px'}} src={`data:image/jpeg;base64,${data}`} />
export class Home extends Component {
    constructor() {
        super();
        this.state = {
            userId: '--2vR0DIsmQ6WfcSzKWigw',
            restaurantId: '',
            restaurant: '',
            restaurantPrediction: '',
            topN: 10,
            minRating: 3,
            restaurants: [],
            userLocationLng: '',
            userLocationLat: '',
            restaurantPictureId: '',
            restaurantPictureList: null,
            restaurantPicture: '',
            radius: 1,
            useRadius: false,
            useAverageRating: false,
            usePredictedRating: true,
            useMinRating: true,
            centerMap: { lat: -25.363, lng: 131.044 }
        }
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMouseoverMarker = this.onMouseoverMarker.bind(this);
        this.handleChangetopN = this.handleChangetopN.bind(this);
        this.handleChangeMinRating = this.handleChangeMinRating.bind(this);
        this.handleMapClicked = this.handleMapClicked.bind(this);
        this.handleMapSearch = this.handleMapSearch.bind(this);
        this.handleShowAllRestaurants = this.handleShowAllRestaurants.bind(this);
        this.handlePredictSpecific = this.handlePredictSpecific.bind(this);
        this.handleMapSearchBest = this.handleMapSearchBest.bind(this);
        this.handleNextPicture = this.handleNextPicture.bind(this);
        this.handlePreviousPicture = this.handlePreviousPicture.bind(this);
        this.handleCheckedPredicted = this.handleCheckedPredicted.bind(this);
        this.handleCheckedAverage = this.handleCheckedAverage.bind(this);
        this.handleCheckedRadius = this.handleCheckedRadius.bind(this);
        this.handleChangeRadius = this.handleChangeRadius.bind(this);
    }   
    
    componentDidMount()
    {
        this.setState({centerMap: { lat: 42.355812, lng: -71.1374419 }});
    }

    onMarkerClick(id)
    {
        alert(this.state.restaurants.length);
        this.setState({restaurantId: id});
        this.setState({restaurantPrediction: ''});

        axios.get('http://localhost:5000/restaurant/'+id, { headers: {accept: 'application/json'} }).then(res => 
        {
            this.setState({restaurant:res.data});
        }).catch(error => { alert(error); });

        axios.get('http://localhost:5000/images/'+id, { headers: {accept: 'application/json'} }).then(res => 
        {
            if (res.data == null || res.data.length == 0)
            {
                this.setState({restaurantPictureList:null});
                this.setState({restaurantPictureId: ''});
                this.setState({restaurantPicture: ''});
            }
            else
            {
                this.setState({restaurantPictureList:res.data});
                this.setState({restaurantPictureId: res.data[0]});

                axios.get('http://localhost:5000/image/'+res.data[0], {}).then(res => 
                {
                    this.setState({restaurantPicture: res.data});
                }).catch( error => { });
            }
        }).catch(error => { alert(error); });
    }
    
    handlePreviousPicture()
    {
        if(this.state.restaurantPictureList != null)
            for(let i=0;i<this.state.restaurantPictureList.length;i++)
            {
                if(this.state.restaurantPictureList[i] == this.state.restaurantPictureId)
                {
                    if(i > 0)
                    {
                        this.setState({restaurantPictureId: this.state.restaurantPictureList[i-1]});
                        axios.get('http://localhost:5000/image/'+this.state.restaurantPictureList[i-1], {}).then(res => 
                        {
                            this.setState({restaurantPicture: res.data});
                        }).catch( error =>{});
                    }
                }
            }
    }

    handleNextPicture()
    {
        if(this.state.restaurantPictureList != null)
            for(let i=0;i<this.state.restaurantPictureList.length;i++)
            {
                if(this.state.restaurantPictureList[i] == this.state.restaurantPictureId)
                {
                    if(i < this.state.restaurantPictureList.length-1)
                    {
                        this.setState({restaurantPictureId: this.state.restaurantPictureList[i+1]});
                        axios.get('http://localhost:5000/image/'+this.state.restaurantPictureList[i+1], {}).then(res => 
                        {
                            this.setState({restaurantPicture: res.data});
                        }).catch( error => {});
                    }
                }
            }
    }

    handleShowAllRestaurants()
    {
        axios.get('http://localhost:5000/restaurantAll', {headers: {accept: 'application/json'} }).then(res => 
        {
            this.setState({restaurants:res.data});
        }).catch(error =>{ alert(error); });
    }

    handlePredictSpecific()
    {
        axios.get('http://localhost:5000/predictSpecific/'+this.state.userId+'/'+this.state.restaurantId, 
            {headers: {accept: 'application/json'} }).then(res => 
        {
            this.setState({restaurantPrediction:res.data});
        }).catch(error =>{ alert(error); });
    }

    onMouseoverMarker(props, marker, e)
    {
    }

    handleCheckedPredicted()
    {
        if(this.state.usePredictedRating && this.state.useAverageRating)
            this.setState({usePredictedRating: false});

        else if(this.state.usePredictedRating && !this.state.useAverageRating)
        {
            this.setState({usePredictedRating: false});
            this.setState({useAverageRating: true});
        }

        else
            this.setState({usePredictedRating: true});
    }

    handleCheckedAverage()
    {
        if(this.state.useAverageRating && this.state.usePredictedRating)
            this.setState({useAverageRating: false});

        else if(!this.state.usePredictedRating && this.state.useAverageRating)
        {
            this.setState({usePredictedRating: true});
            this.setState({useAverageRating: false});
        }

        else
            this.setState({useAverageRating: true});
    }

    handleCheckedRadius()
    {
        if(this.state.useRadius)
            this.setState({useRadius: false});
        else
            this.setState({useRadius: true});
    }

    handleChangeRadius(event)
    {
        this.setState({radius: event.target.value});
    }

    handleChangetopN(event)
    {
        this.setState({topN: event.target.value});
    }

    handleChangeMinRating(event)
    {
        this.setState({minRating: event.target.value});
    }

    handleMapClicked(mapProps, map, clickEvent) 
    {
        this.setState({userLocationLat: clickEvent.latLng.lat()})
        this.setState({userLocationLng: clickEvent.latLng.lng()})
    }

    handleMapSearch(){
        axios.get('http://localhost:5000/predict/'  + this.state.userId + '/'
                                                    + this.state.topN + '/'
                                                    + this.state.minRating + '/'
                                                    + this.state.userLocationLat + '/'
                                                    + this.state.userLocationLng + '/'
                                                    + this.state.radius + '/'
                                                    + Number(this.state.useRadius) + '/'
                                                    + Number(this.state.usePredictedRating) + '/'
                                                    + Number(this.state.useAverageRating) + '/'
                                                    + Number(this.state.useMinRating),
            { headers: {accept: 'application/json'} }).then(res => 
        {
            if(res.data == null || res.data.length == 0)
            {
                alert("There are no restaurants in the radius for the given parameters!");
                this.setState({restaurants:[]});
            }
            else{
                this.setState({restaurants:res.data});
            }
        }).catch(error =>{ alert(error); });
        this.forceUpdate();
    }

    handleMapSearchBest()
    {
        axios.get('http://localhost:5000/predictBest/'  + this.state.userId+'/'
                                                        + this.state.topN+'/'
                                                        + this.state.minRating,
            {headers: {accept: 'application/json'} }).then(res => 
        {
            this.setState({restaurants:res.data});
        }).catch(error =>{ alert(error); });
    }
    
    render() {
        return (
            <div style={{width:'100%'}}>
                <div id="naslov">
                    <label id="naslovLabel">Restaurant recommender system</label>
                </div>
                <div class="grid-container" style={{width:'100%'}}>
                <div class="grid-item" id="grid-item3">
                        <table style={{'text-align':'center', width:'100%', height:'100%',padding:'5px'}}>
                            <tr>
                                <td style={{'font-size': 'x-large', 'text-align':'center', 'background-color': '#2f6914bd'}} colspan='4'>Specify</td>
                            </tr>
                            <tr>
                                <td><Button variant="danger" onClick={this.handleCheckedPredicted}>Use predicted rating</Button></td>
                                <td><Checkbox checked = {this.state.usePredictedRating}></Checkbox></td>
                                <td><Button variant="danger" onClick={this.handleCheckedRadius}>Use radius</Button></td>
                                <td><Checkbox checked = {this.state.useRadius}></Checkbox></td>
                            </tr>
                            <tr>
                                <td><Button variant="danger" onClick={this.handleCheckedAverage}>Use average rating</Button></td>
                                <td><Checkbox checked = {this.state.useAverageRating}></Checkbox></td>
                                <td>Radius (km)</td>
                                <td><input  id = "radius" onChange={this.handleChangeRadius} type="number" className="form-control" min='1' max='100' placeholder='1'/></td>
                            </tr>
                        </table>
                    </div>
                    <div class="grid-item" id="grid-item1">
                        <table style={{'text-align':'center', width:'100%',padding:'5px'}}>
                            <tr>
                                <td style={{'font-size': 'x-large', 'text-align':'center', 'background-color': '#2f6914bd'}} colspan='2'>Recommend</td>
                            </tr>
                            <tr>
                                <td class="paddCells">Enter N</td>
                                <td class="paddCells"><input  id = "topN" onChange={this.handleChangetopN} type="number" step='1' min ='1' max='100' className="form-control" placeholder='10'/></td>
                            </tr>
                            <tr>
                                <td class="paddCells">Enter Min rating</td>
                                <td class="paddCells"><input  id = "minRating" onChange={this.handleChangeMinRating} type="number" step = '0.1' className="form-control" min='1' max='5' placeholder='3'/></td>
                            </tr>
                        </table>
                        
                        <Button id="recommenderButtons1" variant="success" onClick={this.handleMapSearch}>N cloasest</Button>
                        <Button id="recommenderButtons2" variant="success" onClick={this.handleMapSearchBest}>N best in city</Button>
                    </div>
                    <div class="grid-item" id="grid-item2">
                        <table style={{'text-align':'center', width:'100%', height:'100%',padding:'5px'}}>
                            <tr>
                                <td style={{'font-size': 'x-large', 'text-align':'center', 'background-color': '#2f6914bd'}} colspan='2'>Predict</td>
                            </tr>
                            <tr>
                                <td class="paddCells">User ID</td>
                                <td class="paddCells"><input id="userid" onChange={this.handleChangeUserId} type="text" className="form-control" value={this.state.userId}/></td>
                            </tr>
                            <tr>
                                <td class="paddCells">Restaurant ID</td>
                                <td class="paddCells"><input id="restaurantid" onChange={this.handleChangeRestaurantId} type="text" className="form-control" value={this.state.restaurantId}/></td>
                            </tr>
                            <tr>
                                <td class="paddCells"><Button id="recommenderButtons3" variant="primary" onClick={this.handleShowAllRestaurants}>Show all</Button></td>
                                <td class="paddCells"><Button id="recommenderButtons4" variant="primary" onClick={this.handlePredictSpecific}>Predict rating</Button></td>
                            </tr>
                        </table>
                    </div>
                    <div class="grid-item" id="grid-item4">
                        <table id="restaurant_info">
                            <tr>
                                <td style={{'font-size': 'xx-large', 'text-align':'center', 'background-color': '#2f6914bd'}} colspan='3'>{this.state.restaurant.name ? this.state.restaurant.name : 'Please select a restaurant'}</td>
                            </tr>
                            <tr>
                                <td class='leftCells'>ID</td>
                                <td class='middleCells'></td>
                                <td class='rightCells'>{this.state.restaurant.business_id}</td>
                            </tr>
                            <tr>  
                                <td class='leftCells'>Average rating</td>
                                <td class='middleCells'></td>
                                <td class='rightCells'>{this.state.restaurant.stars}</td>
                            </tr>  
                            <tr>
                                <td class='leftCells'>City</td>
                                <td class='middleCells'></td>
                                <td class='rightCells'>{this.state.restaurant.city}</td>
                            </tr> 
                            <tr>
                                <td class='leftCells'>Address</td>
                                <td class='middleCells'></td>
                                <td class='rightCells'>{this.state.restaurant.address}</td>
                            </tr> 
                            <tr>
                                <td class='leftCells'>Number of ratings</td>
                                <td class='middleCells'></td>
                                <td class='rightCells'>{this.state.restaurant.review_count}</td>
                            </tr>
                            <tr>
                                <td class='leftCells' id="predRatingLeftCell">Predicted rating</td>
                                <td class='middleCells'></td>
                                <td class='rightCells' id="predRatingRightCell">{this.state.restaurantPrediction?
                                 parseFloat(this.state.restaurantPrediction).toFixed(1)
                                 :
                                 ''
                                }</td>
                            </tr> 
                        </table>
                    </div>
                    
                    <div class="grid-item" id="grid-item6">
                    {
                                this.state.restaurantPicture && 
                                <Button class="pictureButtons" class="recommenderButtons" variant="success" onClick={this.handlePreviousPicture} visible={this.state.restaurantPicture}>{'<'}</Button>
                            }
                            {
                                this.state.restaurantPicture ?
                                    <Picture data={this.state.restaurantPicture} />
                                    :
                                    <p style={{color:'red'}}>There are no photos for the selected restaurant</p>
                            }
                            {
                                this.state.restaurantPicture && 
                                <Button class="pictureButtons" class="recommenderButtons" variant="success" onClick={this.handleNextPicture}>{'>'}</Button>
                            }   
                    </div>

                    <div class="grid-item"  id="grid-item5" style={{height:'600px', width:'100%'}}>
                        <table style={{'text-align':'center', width:'100%'}}>
                            <tr>
                                <td style={{'font-size': 'x-large', 'text-align':'center', 'background-color': '#2f6914bd'}}>Choose your location or a restaurant</td>
                            </tr>
                            <tr>
                                <td><Map 
                                    google={this.props.google} 
                                    zoom={14} 
                                    style={style}
                                    center={this.state.centerMap}
                                    onClick = {this.handleMapClicked}
                                    containerStyle={{ width: '69%', height: '100%'}}
                                    >
                                    {this.state.restaurants.map(pin => (
                                        <Marker 
                                            position={{ lat: pin.lat, lng: pin.lng }} 
                                            key={"a"} 
                                            onClick={() => this.onMarkerClick(pin.business_id)} 
                                            onMouseover={this.onMouseoverMarker}
                                            name={pin.name} 
                                        />
                                        
                                    ))}
                                    <Marker 
                                        position={{ lat: this.state.userLocationLat, lng: this.state.userLocationLng }} 
                                        icon = {{url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}}
                                    />
                                    <Circle
                                        center={{ lat: this.state.userLocationLat, lng: this.state.userLocationLng }}
                                        radius={this.state.radius*1000}
                                        visible = {this.state.useRadius}
                                        />
                                    </Map>
                                </td> 
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

}

export default GoogleApiWrapper({ })(Home);
