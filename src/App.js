import { Route } from "react-router-dom";
import Home from "./views/home";
import Avatars from "./views/avatars";
import Avatar from "./views/avatar";
import MainLayout from "./layouts/main";

function App() {
  
  return (
    <MainLayout>
      <Route path="/" exact component={Home} />
      <Route path="/avatars" exact component={Avatars} />
      <Route path="/avatars/:tokenId" exact component={Avatar} />
    </MainLayout>
  );
}

export default App;