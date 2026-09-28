
function Login(){
    return (
        <div className="login min-h-screen flex items-center justify-center">
            <div className="container max-w-sm w-full">
                <form onSubmit={()=>{}}>
                <ul className="list-none space-y-2">
                    <li className="logo flex w-full"><img src="../../src/assets/logo2.png" alt="logo"/></li>
                    <li><input className="login-email border-2 border-app-text rounded-lg h-12 w-full" type="email" placeholder="E-mail"/></li>
                    <li><input className="login-password border-2 border-app-text rounded-lg h-12 w-full" type="password" placeholder="Password"/></li>
                    <li><input className="login-submit bg-cyan-500 text-white text-lg font-bold rounded-lg h-10 w-full" type="submit" value="Login"/></li>
                </ul>
                </form>
            </div>
        </div>
    )
}
export default Login;