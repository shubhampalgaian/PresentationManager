import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import MultipleAPPS from "./component/MultipleAPPS";
// import Listtab from "./component/Listtab/Listtab";
import Apps from "./component/Apps/Apps";
import AddUrlForm from "./component/AddNewAppForm/AddUrlForm";
import Presentations from "./component/Presentations/Presentations";
import AddPresentation from "./component/AddNewPresentationForm/AddPresentation";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Apps />} />
          <Route path="/multipleapps" element={<MultipleAPPS />} />
          <Route path="/addurl" element={<AddUrlForm />} />
          <Route path="/presentation" element={<Presentations />} />
          <Route path="/addpresentation" element={<AddPresentation />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
