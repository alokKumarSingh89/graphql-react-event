import React, {Component} from 'react';
import {authenticatUser} from "../context/auth-context"
import "./auth.css"
class AuthPage extends Component {
    state = {
        email:'',
        password:'',
        isLogin:false
    }
    onUpdateProps = event =>{
        console.log(event.target.name,event.target.value);
        this.setState({[event.target.name]:event.target.value});
    }
    onSubmit = event =>{
        event.preventDefault();
        const {email ,password,isLogin} = this.state;
        const {doLogin} = this.props;
        if(email.trim().length ===0 || password.trim().length === 0){
            return;
        }
        let body = {
            query: `
                query{
                    login(email:"${email}",password:"${password}"){
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        }
        if(!isLogin){
            body = {
                query:`
                mutation{
                    createUser(userInput:{email:"${email}",password:"${password}"}){
                        _id
                        email
                    }
                }
            `
            }
        }

        fetch('http://localhost:4000/graphql',{
            method:'POST',
            body:JSON.stringify(body),
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>{
            if(res.status!==200 && res.status !== 201){
                throw new Error("Fails")
            }
            return res.json();
        }).then(res=>{
            if(res.data.login.token){
                doLogin(res.data.login.token,res.data.login.userId,res.data.login.tokenExpiration);
            }


        }).catch((error)=>{
            console.error(error)
        })
    }
    toggleLogin = () =>{
        this.setState(preState=>{
            return {
                ...preState,
                isLogin: !preState.isLogin
            }
        })
    }
    render() {
        const {email ,password,isLogin} = this.state;

        return (
            <form className="auth-form" onSubmit={this.onSubmit}>
                <div className="form-control">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" value={email} onChange={this.onUpdateProps}/>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={password} onChange={this.onUpdateProps}/>
                </div>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.toggleLogin}>Switch {!isLogin?'Login':'SignUp'}</button>

                </div>
            </form>
        );
    }
}

export default authenticatUser(AuthPage);