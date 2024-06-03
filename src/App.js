import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import MultipleAPPS from "./component/MultipleAPPS";
// import Listtab from "./component/Listtab/Listtab";
import Apps from "./component/Apps/Apps";
import AddUrlForm from "./component/AddNewAppForm/AddUrlForm";
import Presentations from "./component/Presentations/Presentations";
import AddPresentation from "./component/AddNewPresentationForm/AddPresentation";
import { Toaster } from "react-hot-toast";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useLoaderContext } from "./utils/LoaderContext";


function App() {
  const { isLoading } = useLoaderContext();
  console.log({isLoading});
  return (
    <>
      <BrowserRouter>
      <div><Toaster   position="top-right" /></div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
