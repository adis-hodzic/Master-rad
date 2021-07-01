import React, { Component, useImperativeHandle } from "react";
import axios from 'axios';
import './instrukcija.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from"react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import Modal from 'react-modal';
import {toast, ToastContainer} from 'react-toastify'

export default class Instrukcija extends Component {
    constructor(props) {
        super();
        this.state = {
            token : localStorage.getItem('token'),
            id : '',
            subjectId : '',
            scheduledDate : '',
            numberOfClasses : '',
            instructorId : '',
            clientId : '',
            active : false,
            firstNameInstruktora:'',
            lastNameInstruktora:'',
            firstNameKlijenta:'',
            lastNameKlijenta:'',
            subjectName:'',
            subjectDescription:'',
            message:'',
            modalOpened:false,
            profilePicClient:null,
            profilePic: null
        };
        this.toggleModal = this.toggleModal.bind(this); 
        this.handleCloseModal = this.handleCloseModal.bind(this); 
        this.handleChangeMessage = this.handleChangeMessage.bind(this);  
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.errorToasterShow = this.errorToasterShow.bind(this);
        this.sucessToasterShow = this.sucessToasterShow.bind(this);
      }

    
    onClick = event => {
        
    }
    componentDidMount(){
        this.setState({id:this.props.id});
        this.setState({subjectId:this.props.subjectId});
        this.setState({scheduledDate:this.props.scheduledDate});
        this.setState({numberOfClasses:this.props.numberOfClasses});
        this.setState({instructorId:this.props.instructorId});
        this.setState({clientId:this.props.clientId});
        this.setState({active:this.props.active});
        
        axios.get('http://localhost:8111/api/management/instructor/'+this.props.instructorId,{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({
                firstNameInstruktora : res.data.firstName,
                lastNameInstruktora : res.data.lastName
            })

          }).catch( error =>{
              
          }
        );

        axios.get('http://localhost:8111/api/management/client/'+this.props.clientId,{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({
                firstNameKlijenta : res.data.firstName,
                lastNameKlijenta : res.data.lastName
            })

          }).catch( error =>{
              
          }
        );
        axios.get('http://localhost:8111/api/management/imageClient/'+this.props.clientId,{
            headers: {
                Authorization: this.state.token
            }}).then(res => {

            if(res.data != null)
                this.setState({
                    profilePicClient : "data:image/png;base64," + res.data
                })

        }).catch( error =>{

            }
        );
        axios.get('http://localhost:8111/api/management/image/'+this.props.instructorId,{
            headers: {
                Authorization: this.state.token
            }}).then(res => {

            if(res.data != null)
                this.setState({
                    profilePic : "data:image/png;base64," + res.data
                })

        }).catch( error =>{

            }
        );
        axios.get('http://localhost:8111/api/management/subject/'+this.props.subjectId,{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({
                subjectName : res.data.name,
                subjectDescription : res.data.description
            })

          }).catch( error =>{
              
          }
        );
    }
    toggleModal() {
        this.setState({ modalOpened: true });
      }

    handleCloseModal(){
        this.setState({ modalOpened: false });
    }
    
    handleChangeMessage(event){
        this.setState({message: event.target.value});
    }

    handleOnSubmit(event){
        event.preventDefault();
        var MessageRequest = {
            "message": this.state.message
        };
        
            axios.post('http://localhost:8111/api/request/instructions-message-p/'+this.props.id,
                MessageRequest, {
                    headers: {
                        Authorization: this.state.token 
                    }}).then(res => {
                        this.setState({ modalOpened: false});
                        this.sucessToasterShow();
                }).catch(err =>{                       
                    this.errorToasterShow();
                });
        
    }

    errorToasterShow(){
        toast.error('Greska', {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    }

    sucessToasterShow(){
        toast.success('Uspješno ste poslali komentar', {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    render() {
        
        const onClick = () => {
            
        }

        return (
            <Card id="instruktorKartica" style={{ width: '80%' }}>
                <table class="datumOcjena">
                    <tr>
                        <td><Card.Img class="profilnaSlika" variant="top" src={this.state.profilePic ? this.state.profilePic : "profile.jpg"} /></td>
                        <td><Card.Body id="instruktorInfo">
                            <Card.Title id="naslov">{this.state.firstNameInstruktora} {this.state.lastNameInstruktora}</Card.Title>
                            <Card.Text id="asda">{this.state.subjectName}: {this.state.subjectDescription}</Card.Text>
                            <Card.Text>Datum: {this.state.scheduledDate}</Card.Text>
                            </Card.Body>
                        </td>
                        
                        <td><Card.Body id="instruktorInfo">
                            <Card.Title id="naslov">{this.state.firstNameKlijenta} {this.state.lastNameKlijenta}</Card.Title>
                            <Card.Text id="asda">Broj časova: {this.state.numberOfClasses}</Card.Text>
                            {this.state.active ? <Card.Text style={{color:'green'}} id="aktivnaInstrukcija">Aktivna</Card.Text> : <Card.Text style={{color:'red'}} id="aktivnaInstrukcija">Nije aktivna</Card.Text>}
                            <Button variant="primary" onClick={this.toggleModal}>Pošalji komentar</Button>
                                
                            </Card.Body>
                        </td>
                        <td><Card.Img id="profilnaSlikaKlijent" variant="top" src={this.state.profilePicClient ? this.state.profilePicClient : "client.png"} /></td>
                    </tr>
                </table>
                
                <Modal isOpen={this.state.modalOpened} contentLabel="Poruka" className='custom-dialog'>
                    <form onSubmit={this.handleOnSubmit}>
                        <Card.Title id="naslov">Poruka:</Card.Title>
                        <input id = "comment" onChange={this.handleChangeMessage} type="username" className="form-control" placeholder="Dodajte poruku" />
                        <button type="submit">Posaljite poruku</button>
                        <button class="btn btn-info" onClick={this.handleCloseModal}>Zatvori</button>
                    </form>
                </Modal>
                    
                
            </Card>
        );
    }
}