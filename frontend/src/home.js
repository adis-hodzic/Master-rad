import React, { Component, useImperativeHandle } from "react";
import axios from 'axios';
import './home.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Checkbox, RadioGroup } from "@material-ui/core";

import {Map, InfoWindow, Marker, GoogleApiWrapper, Circle} from 'google-maps-react';
const style = {
    width: '860px',
    height: '570px'
  }
const Example = ({ data }) => <img style={{width:'70%',height:'50%', margin:'auto'}} src={`data:image/jpeg;base64,${data}`} />
export class Home extends Component {
    constructor() {
        super();
        this.state = {
            userId: '--2vR0DIsmQ6WfcSzKWigw',
            restaurantId:'',
            photoId: '---33awF-Qup242BHNPwnw',
            restaurant:'',
            restaurantPrediction:'-',
            profilePic:'',
            topN: 10,
            minRating: 3,
            testPins: [{id: '16V-bdLR2GxMvkz0Ecf10A',lat:42.3613114,lng:-71.0482911},
                {id: 'kTr8sgcy-ugEVvgtGJyCNQ',lat:42.354636,lng:-71.070787},
                {id: 'tvJwRgbOZYHK97bMgvMBIA',lat:42.3593008,lng:-71.1270268},
                {id: 'Yrp_5hrbRyUmDgfYAjTe3w',lat:42.3796489,lng:-71.0717834},
                {id: '5NsdznaNSUmH2O0vuo65Pw',lat:42.349712093,lng:-71.0891945599},
                {id: 'GSkTeP1iDKGS9GZJqyRKPg',lat:42.3569946,lng:-71.060486}],
            restaurants: [],
            userLocationLng: '',
            pictureId:'',
            userLocationLat: '',
            pictureList:null,
            radius:1,
            useRadius:false,
            useAverageRating:false,
            usePredictedRating:true,
            useMinRating:true,
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
    
    componentDidMount(){
        this.setState({centerMap: { lat: 42.355812, lng: -71.1374419 }});
    }

    onMarkerClick(id){
        this.setState({restaurantId: id});

        axios.get('http://localhost:5000/restaurant/'+id,{
            headers: {accept: 'application/json'
            }}).then(res => {
                this.setState({restaurant:res.data});
                })
                .catch(error =>{
                    alert(error);
                })

        axios.get('http://localhost:5000/images/'+id,{
                    headers: {accept: 'application/json'
                    }}).then(res => {
                        if(res.data != null){
                            this.setState({pictureList:res.data});
                            this.setState({pictureId: res.data[0]});

                            axios.get('http://localhost:5000/image/'+res.data[0],{
                            }).then(res => {
                                    this.setState({profilePic: res.data});
                            }).catch( error =>{
                    
                                }
                            );
                        }
                        else{
                            this.setState({pictureList:null});
                            this.setState({pictureId: ''});
                            this.setState({profilePic: ''});
                        }
                        })
                        .catch(error =>{
                            alert(error);
                        })
    }
    handlePreviousPicture(){
        if(this.state.pictureList != null)
            for(let i=0;i<this.state.pictureList.length;i++){
                if(this.state.pictureList[i] == this.state.pictureId){
                    if(i > 0){
                        this.setState({pictureId: this.state.pictureList[i-1]});
                        axios.get('http://localhost:5000/image/'+this.state.pictureList[i-1],{
                        }).then(res => {
                                this.setState({profilePic: res.data});
                        }).catch( error =>{
                
                            }
                        );
                    }
                }
            }
    }
    handleNextPicture(){
        if(this.state.pictureList != null)
            for(let i=0;i<this.state.pictureList.length;i++){
                if(this.state.pictureList[i] == this.state.pictureId){
                    if(i < this.state.pictureList.length-1){
                        this.setState({pictureId: this.state.pictureList[i+1]});
                        axios.get('http://localhost:5000/image/'+this.state.pictureList[i+1],{
                        }).then(res => {
                                this.setState({profilePic: res.data});
                        }).catch( error =>{
                
                            }
                        );
                    }
                }
            }
    }
    handleShowAllRestaurants(){
        axios.get('http://localhost:5000/restaurantAll',{
            headers: {accept: 'application/json'
            }}).then(res => {
                this.setState({restaurants:res.data});
                })
                .catch(error =>{
                    alert(error);
                })
    }
    handlePredictSpecific(){
        axios.get('http://localhost:5000/predictSpecific/'+this.state.userId+'/'+this.state.restaurantId,{
            headers: {accept: 'application/json'
            }}).then(res => {
                this.setState({restaurantPrediction:res.data});
                })
                .catch(error =>{
                    alert(error);
                })
    }
    onMouseoverMarker(props, marker, e){
            
    }
    handleCheckedPredicted(){
        if(this.state.usePredictedRating && this.state.useAverageRating)
            this.setState({usePredictedRating: false});
        else if(this.state.usePredictedRating && !this.state.useAverageRating){
            this.setState({usePredictedRating: false});
            this.setState({useAverageRating: true});
        }
        else
            this.setState({usePredictedRating: true});
    }
    handleCheckedAverage(){
        if(this.state.useAverageRating && this.state.usePredictedRating)
            this.setState({useAverageRating: false});
        else if(!this.state.usePredictedRating && this.state.useAverageRating){
            this.setState({usePredictedRating: true});
            this.setState({useAverageRating: false});
        }
        else
            this.setState({useAverageRating: true});
    }
    handleCheckedRadius(){
        if(this.state.useRadius)
            this.setState({useRadius: false});
        else
            this.setState({useRadius: true});
    }
    handleChangeRadius(event){
        this.setState({radius: event.target.value});
    }
    handleChangetopN(event){
        this.setState({topN: event.target.value});
    }
    handleChangeMinRating(event){
        this.setState({minRating: event.target.value});
    }
    handleMapClicked(mapProps, map, clickEvent) {
        //this.setState({centerMap: clickEvent.latLng});
        this.setState({userLocationLat: clickEvent.latLng.lat()})
        this.setState({userLocationLng: clickEvent.latLng.lng()})
    }
    handleMapSearch(){
        axios.get('http://localhost:5000/predict/'+this.state.userId+'/'
        +this.state.topN+'/'+this.state.minRating+'/'
        +this.state.userLocationLat+'/'+this.state.userLocationLng+'/'
        +this.state.radius+'/'+Number(this.state.useRadius)+'/'
        +Number(this.state.usePredictedRating)+'/'+Number(this.state.useAverageRating)+'/'
        +Number(this.state.useMinRating),{
            headers: {accept: 'application/json'
            }}).then(res => {
                this.setState({restaurants:res.data});
                })
                .catch(error =>{
                    alert(error);
                })
    }
    handleMapSearchBest(){
        axios.get('http://localhost:5000/predictBest/'+this.state.userId+'/'+this.state.topN+'/'+this.state.minRating,{
            headers: {accept: 'application/json'
            }}).then(res => {
                this.setState({restaurants:res.data});
                })
                .catch(error =>{
                    alert(error);
                })
    }
    
    
    render() {
        

        return (
            <div>
                <div id="naslov">
                    <label id="naslovLabel">Restaurant recommender system</label>
                </div>
                <div class="grid-container">
                    <div class="grid-item" id="grid-item1">
                        <table style={{'text-align':'center', width:'100%',padding:'5px'}}>
                            <tr>
                                <td style={{'font-size': 'x-large', 'text-align':'center', 'background-color': '#2f6914bd'}} colspan='2'>Recommend</td>
                            </tr>
                            <tr>
                                <td class="paddCells">Enter N</td>
                                <td class="paddCells"><input  id = "topN" onChange={this.handleChangetopN} type="number" step='1' min='1' max='100' className="form-control" placeholder='10'/></td>
                            </tr>
                            <tr>
                                <td class="paddCells">Enter Min rating</td>
                                <td class="paddCells"><input  id = "minRating" onChange={this.handleChangeMinRating} type="number" step = '0.1' className="form-control" min='1' max='5' paceholder='3'/></td>
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
                                <td class="paddCells">Enter User ID</td>
                                <td class="paddCells"><input id="userid" onChange={this.handleChangeUserId} type="text" className="form-control" value={this.state.userId}/></td>
                            </tr>
                            <tr>
                                <td class="paddCells">Enter Restaurant ID</td>
                                <td class="paddCells"><input id="restaurantid" onChange={this.handleChangeRestaurantId} type="text" className="form-control" value={this.state.restaurantId}/></td>
                            </tr>
                            <tr>
                                <td class="paddCells"><Button id="recommenderButtons3" variant="primary" onClick={this.handleShowAllRestaurants}>Show all</Button></td>
                                <td class="paddCells"><Button id="recommenderButtons4" variant="primary" onClick={this.handlePredictSpecific}>Predict rating</Button></td>
                            </tr>
                        </table>
                    </div>
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
                                <td>Radius(km)</td>
                                <td><input  id = "radius" onChange={this.handleChangeRadius} type="number" className="form-control" min='1' max='100'/></td>
                            </tr>
                        </table>
                    </div>
                    <div class="grid-item" id="grid-item4">
                        <table id="restaurant_info">
                            <tr>
                                <td style={{'font-size': 'xx-large', 'text-align':'center', 'background-color': '#2f6914bd'}} colspan='2'>{this.state.restaurant.name}</td>
                            </tr>
                            <tr>
                                <td>ID: {this.state.restaurant.business_id}</td>
                                <td>Average rating: {this.state.restaurant.stars}</td>
                            </tr>
                            <tr>
                                <td>City: {this.state.restaurant.city}</td>
                                <td>Predicted rating: {this.state.restaurantPrediction}</td>
                            </tr>
                            <tr>
                                <td>Adress: {this.state.restaurant.address}</td>
                            </tr>
                            <tr>
                                <td>Number of ratings: {this.state.restaurant.review_count}</td>
                            </tr>
                            <tr>
                            <td style={{'text-align':'center',padding:'10px'}} colspan='2'>
                            <Button class="recommenderButtons" variant="success" onClick={this.handlePreviousPicture}>{'<'}</Button>
                            <Example data={this.state.profilePic} />
                            <Button class="recommenderButtons" variant="success" onClick={this.handleNextPicture}>{'>'}</Button>
                                </td>
                            </tr>
                        </table>
                    </div>
                    

                    
                    <div class="grid-item"  id="grid-item5" style={{height:'500px'}}>
                        <Map 
                            google={this.props.google} 
                            zoom={14} 
                            style={style}
                            center={this.state.centerMap}
                            onClick = {this.handleMapClicked}
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
                    </div>
                </div>
            </div>
        );
    }

}

export default GoogleApiWrapper({
    
  })(Home)