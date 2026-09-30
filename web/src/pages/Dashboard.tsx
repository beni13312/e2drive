import Files from "../components/Files.tsx";

function Dashboard(){
    return (
        <div className="dashboard">
            <header className="header shadow-[0_4px_8px_rgba(0,0,0,0.15)]" >
                <ul className="list-none ml-5">
                    <li className="logo flex w-15"><img src="../../src/assets/logo.png" alt="logo"/></li>
                </ul>
            </header>
            <main className="main w-full">
               <Files />
            </main>
        </div>
    )
}
export default Dashboard;