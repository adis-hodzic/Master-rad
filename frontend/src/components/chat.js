import React, { Component, useImperativeHandle } from "react";
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listMessage : "List is empty",
            chatMessage : "No client selected",
            token : localStorage.getItem('token'),
            listOfClients : null,
            listOfClientsNull : true,
            selectedClient : null,
            isClientSelected: false,
            messageList: null,
            isMessageListEmpty: true,
            emptyMessageList: '',
            writtenMessage: '',
            time: Date.now()
        };
        this.createClientList = this.createClientList.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onHover = this.onHover.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.createMessageList = this.createMessageList.bind(this);
        this.handleChangeMessage = this.handleChangeMessage.bind(this);
        this.callEverySec = this.callEverySec.bind(this);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
      }

      errorToasterShow(){
        toast.error('Doslo je do greške!', {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
      }

    componentDidMount(){
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
        if(localStorage.getItem('currentUserRole')==2){
        axios.get('http://localhost:8111/api/management/clients',{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({listMessage : "List of all clients: ",
                            listOfClients : res.data})
                            
        this.setState({listOfClientsNull : false})
          }).catch( error =>{
              this.errorToasterShow();
          }
        )
        }
        else if(localStorage.getItem('currentUserRole')==3){
            axios.get('http://localhost:8111/api/management/instructors',{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({listMessage : "List of all clients: ",
                            listOfClients : res.data})
                            
        this.setState({listOfClientsNull : false})
          }).catch( error =>{
              this.errorToasterShow();
          }
        )
        }
    }
    handleChangeMessage(event) {
        this.setState({writtenMessage: event.target.value});
    }
    onSubmit = event => {
        event.preventDefault();
        var message = {'message': this.state.writtenMessage,
                        'sender': 'client'};
        if(localStorage.getItem('currentUserRole') == 2){
            message.sender = 'instructor';
        axios.post('http://localhost:8111/api/messaging/message-instructor/'+localStorage.getItem('currentUserId')+'/'+this.state.selectedClient.id,
                message, {headers: {
                    Authorization: this.state.token 
                  }}).then(res =>{
            axios.get('http://localhost:8111/api/messaging/messages/'+localStorage.getItem('currentUserId')+'/'+this.state.selectedClient.id,{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({messageList:res.data});
            this.setState({isMessageListEmpty: false});
            }).catch( error =>{
                 if(error.response.status == '404'){
                    this.setState({emptyMessageList:error.response.data.errorMessage, isMessageListEmpty:true,messageList:null})
                }
            }
          )
        }).catch(error =>{
            this.errorToasterShow();
        })
    }else if(localStorage.getItem('currentUserRole') == 3){
        message.sender = 'client';
    axios.post('http://localhost:8111/api/messaging/message-client/'+this.state.selectedClient.id+'/'+localStorage.getItem('currentUserId'),
            message, {headers: {
                Authorization: this.state.token 
              }}).then(res =>{
        axios.get('http://localhost:8111/api/messaging/messages/'+this.state.selectedClient.id+'/'+localStorage.getItem('currentUserId'),{
        headers: {
          Authorization: this.state.token 
        }}).then(res => {
        this.setState({messageList:res.data});
        this.setState({isMessageListEmpty: false});
        }).catch( error =>{
            if(error.response.status == '404'){
                this.setState({emptyMessageList:error.response.data.errorMessage, isMessageListEmpty:true,messageList:null})
            }
        }
      )
    }).catch(error =>{
        this.errorToasterShow();
    })
}

        this.setState({writtenMessage:''})
    }
    onHover = event => {
        event.target.style.backgroundColor = '#FFFFFF';
    }   
    onMouseLeave = event =>{
        event.target.style.backgroundColor = '#F5F5F5';
    }

    createMessageList(item){
        var styleLi = null;
        var addMessage = "";
        if(localStorage.getItem('currentUserRole') == 3){
            if(item.sender === "instructor"){
                addMessage = this.state.selectedClient.firstName+" : "+item.message;        
                styleLi = {
                'listStyleType':'none',
                'marginBottom':'10px',
                'textAlign':'left',
                'height':'30px',
                'backgroundColor':'#F5F5F5',
                'borderRadius':'15px',
                'float':'left',
                'width':'60%',
                'padding':'5px'
                };
            }else{
                addMessage =    item.message;
                styleLi = {
                    'listStyleType':'none',
                    'marginBottom':'10px',
                    'textAlign':'right',
                    'height':'30px',
                    'backgroundColor':'#F5F5F5',
                    'borderRadius':'15px',
                    'float':'right',
                    'width':'60%',
                    'padding':'6px'
    
                };
            }
            return <li onMouseOver={this.onHover} onMouseLeave={this.onMouseLeave} style={styleLi} key={item.id}>{addMessage}</li>
        }else{
            if(item.sender === "instructor"){
                addMessage = item.message;
                styleLi = {
                'listStyleType':'none',
                'marginBottom':'10px',
                'textAlign':'left',
                'height':'30px',
                'backgroundColor':'#F5F5F5',
                'borderRadius':'15px',
                'float':'left',
                'width':'60%',
                'padding':'5px'
                };
            }else{
                addMessage = item.message+" : "+this.state.selectedClient.firstName;
                styleLi = {
                    'listStyleType':'none',
                    'marginBottom':'10px',
                    'textAlign':'right',
                    'height':'30px',
                    'backgroundColor':'#F5F5F5',
                    'borderRadius':'15px',
                    'float':'right',
                    'width':'60%',
                    'padding':'6px'
    
                };
            }
            return <li onMouseOver={this.onHover} onMouseLeave={this.onMouseLeave} style={styleLi} key={item.id}>{addMessage}</li>
        }
        
    }
    callEverySec(e){
        
    }
    createClientList(item){
        var styleLi = null;
        if(item.sender === "instructor"){
            styleLi = {
            'listStyleType':'none',
            'marginBottom':'10px',
            'textAlign':'center',
            'height':'30px',
            'backgroundColor':'#F5F5F5',
            'borderRadius':'15px'
            }
        }else{
            styleLi = {
                'listStyleType':'none',
                'marginBottom':'10px',
                'textAlign':'center',
                'height':'30px',
                'backgroundColor':'#F5F5F5',
                'borderRadius':'15px'
            }
        }
        return <li onMouseOver={this.onHover} onMouseLeave={this.onMouseLeave} style={styleLi} onClick={()=>{
            this.setState({isClientSelected:true, selectedClient:item})
            
            if(localStorage.getItem("currentUserRole")==2){
                axios.get('http://localhost:8111/api/messaging/messages/'+localStorage.getItem('currentUserId')+'/'+item.id,{
                headers: {
                  Authorization: this.state.token 
                }}).then(res => {
                this.setState({messageList:res.data});
                this.setState({isMessageListEmpty: false});
                }).catch( error =>{
                    if(error.response.status == '404'){
                        this.setState({emptyMessageList:error.response.data.errorMessage, isMessageListEmpty:true,messageList:null})
                    }
                }
              )
            }else{
            axios.get('http://localhost:8111/api/messaging/messages/'+item.id+'/'+localStorage.getItem('currentUserId'),{
                headers: {
                  Authorization: this.state.token 
                }}).then(res => {
                this.setState({messageList:res.data});
                this.setState({isMessageListEmpty: false});
                }).catch( error =>{
                    if(error.response.status == '404'){
                        this.setState({emptyMessageList:error.response.data.errorMessage, isMessageListEmpty:true,messageList:null})
                    }
                }
              )
            }
        }} key={item.id}>{item.firstName}</li>
    }
    render() {
        if(this.state.selectedClient!==null && (this.state.time/1000)%9< 1){
            if(localStorage.getItem("currentUserRole")==2){
            axios.get('http://localhost:8111/api/messaging/messages/'+localStorage.getItem('currentUserId')+'/'+this.state.selectedClient.id,{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({messageList:res.data});
            this.setState({isMessageListEmpty: false});
            }).catch( error =>{
                if(error.response.status == '404'){
                    this.setState({emptyMessageList:error.response.data.errorMessage, isMessageListEmpty:true,messageList:null})
                }
            }
          )
        }else{
        axios.get('http://localhost:8111/api/messaging/messages/'+this.state.selectedClient.id+'/'+localStorage.getItem('currentUserId'),{
            headers: {
              Authorization: this.state.token 
            }}).then(res => {
            this.setState({messageList:res.data});
            this.setState({isMessageListEmpty: false});
            }).catch( error =>{
                if(error.response.status == '404'){
                    this.setState({emptyMessageList:error.response.data.errorMessage, isMessageListEmpty:true,messageList:null})
                }
            }
          )
        }
    }
    
        if(!this.state.listOfClientsNull)
        var CL = this.state.listOfClients.map(this.createClientList);
        if(this.state.messageList!=null)
        var CM = this.state.messageList.map(this.createMessageList);
        return (
            <div style={{'height':'100%'}}><nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <ToastContainer></ToastContainer>
            <div className="container">
              <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <Link className="nav-link" to={"/home"}>Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/pocetna"}>Instruktori</Link>
                  </li>                  
                  <li className="nav-item">
                    <Link className="nav-link" to={"/profil"}>Profil</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/chat"}>Chat</Link>
                  </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={"/"}>Log Out</Link>
                    </li>
                </ul>
              </div>
            </div>
          </nav>
          
        <div id="chatRoom" style={{'height':'100%'}}>
            <div id="list" style={{'float':'left', 'width':"20%",'height':'100%'}}>
        <p id="defaultMessageList" style={{'marginTop':'20px','marginLeft':'10%'}}>{this.state.listMessage}</p>
        {this.state.listOfClientsNull ? null :
        <ul style={{'backgroundColor':'#E8E8E8','marginLeft':'70px','widht':'40%','height':'100%','borderRadius':'5px','padding':'20px'}}>{CL}</ul>}
            </div>
            <div id="chat" style={{'float':'right', 'width':"70%"}}>
                {!this.state.isClientSelected ? <p id="defaultMessageChat" style={{'marginTop':'20px'}}>{this.state.chatMessage}</p>
                : <div >
                    <p>Chat with {this.state.selectedClient.firstName}</p>
                    <form onSubmit={this.onSubmit}>
                        <input onChange={this.handleChangeMessage} value={this.state.writtenMessage} type='text' style={{'width':'80%', 'borderRadius':'5px', 'marginRight':'5px','padding':'5px'}} placeholder='Type something'/>
                        <input type='submit' style={{'borderRadius':'2px'}} text='send' value='send'/>      
                    </form>
                    <div style={{"overflowY":"scroll", "height":"450px", }}>  
                    {this.state.isMessageListEmpty ? <p id="defaultMessageChat" style={{'marginTop':'20px'}}>{this.state.emptyMessageList}</p>
                    
                : <div >
                    <ul style={{'height':'100%','borderRadius':'5px','padding':'20px'}}>{CM}</ul>
                </div>
                }</div>
                </div>}
        
            </div>

        </div>
        </div>
        );
    }
}