import React from 'react';
const AuthContext = React.createContext({
    token:null,
    userId:null,
    login:()=>{},
    logout:()=>{}
});
export const authenticatUser = Component => props=>(
    <AuthContext.Consumer>
        {
            context=>(
                <Component {...props} isAuth={context.token} doLogin={context.login}/>
            )
        }
    </AuthContext.Consumer>
)
export default AuthContext;