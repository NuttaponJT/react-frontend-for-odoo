import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

import './App.css';
import MyNavBar from './components/MyNavBar/MyNavBar';
import LeftMenuBar from './components/LeftMenuBar/LeftMenuBar';
import Homepage from "./pages/homepage";
import PushEventMain from "./pages/push-event-main.js";
import CheckListPage from "./components/CheckListPage/CheckListPage";
import ChecklistCollectionPage from "./components/ChecklistCollectionPage/ChecklistCollectionPage";
import RequestController from './controllers/RequestController';

function App() {
  const [activeTab, setactiveTab] = useState("Pages");
  const [odooUserName, SetOdooUserName] = useState("");
  const [checklistPageRoute, setChecklistPageRoute] = useState([]);
  const [pageListRoute, setPageListRoute] = useState([]);
  const legacyUrl = `${process.env.REACT_APP_LEGACY_URL}`;

  useEffect(() => {
    initUserInformation();
    initChecklistPage();
    window.addEventListener("add-checklist-route-signal", handleAddChecklistRouteSignal);

    return () => {
      window.removeEventListener("add-checklist-route-signal", handleAddChecklistRouteSignal);
    }
  }, []);

  const updateUserInformation = () => {
    RequestController.getUserInformation({
      uid: window.odoouserid, 
    })
    .then(response => response.json())
    .then((data) => {
      const result = data["result"];
      if(result["status"] === "success"){
        sessionStorage.setItem("userName", result["body"]["username"]);
        sessionStorage.setItem("userRole", result["body"]["role"]);
        sessionStorage.setItem("userId", window.odoouserid);
        SetOdooUserName(result["body"]["username"]);
      }
    });
  }

  const initUserInformation = async () => {
    await checkSessionId();
    updateUserInformation();
  }

  const handleAddChecklistRouteSignal = (event) => {
    let checklist_ref = event["detail"]["ref"];
    let list_checklist_ref = [checklist_ref];
    addChecklistPageRoute(list_checklist_ref);
  }

  const initChecklistPage = () => {
    RequestController.getChecklistDatas({})
    .then(response => response.json())
    .then((data) => {
      const result = data["result"];
      if(result["status"] === "success"){
        setChecklistPageRoute(result["body"]);
      }
    });
    RequestController.getPages({})
    .then(response => response.json())
    .then((data) => {
      const result = data["result"];
      if(result["status"] === "success"){
        let pageList = [];
        Object.keys(result["body"]).forEach((id) => {
          pageList.push(result["body"][id]["name"]);
        });
        setPageListRoute([...pageListRoute, ...pageList]);
      }
    });
  };

  const addChecklistPageRoute = (list_checklist_ref) => {
    setChecklistPageRoute([...checklistPageRoute, ...list_checklist_ref]);
  };

  var getAuthSession = () => {
    return fetch(`${process.env.REACT_APP_HOST_ENDPOINT}/web/session/authenticate`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify({
        "jsonrpc": "2.0", 
        "params": {
          "db": "test-react",
          "login": "admin", 
          "password": "123456"
        }
      })
    })
    .then(response => response.json())
    .then((data) => {
      return [data["result"]["odoosession"], data["result"]["odoouid"]];
    });
  };

  const checkSessionId = async () => {
    if(window.odoosession === undefined){
      [window.odoosession, window.odoouserid] = await getAuthSession();
    }
  }

  // const getData = async () => {
  //   fetch("http://10.254.1.62:8206/api/pdpa/test_pull_data", {
  //     method: "POST", 
  //     headers: {
  //       "Content-Type": "application/json", 
  //       "Authorization": "Bearer 5ecbb353076c3a9957e23ff9a657784bb07967d4"
  //     }, 
  //     body: JSON.stringify({
  //       sessionId: `${window.odoosession}`, 
  //       test: "echo test"
  //     })
  //   })
  //   .then(response => response.json())
  //   .then((data) => {
  //     console.log(data)
  //   });
  // };

  // getData();

  return (
    <div>
      <header></header>
      <body>
        <Router>
          <MyNavBar userName={odooUserName} activeTabProp={{activeTab: activeTab, setactiveTab: setactiveTab}} />
          <div class="main-body">
            <Routes>
              <Route path={legacyUrl} element={
                <LeftMenuBar activeTabProp={{activeTab: activeTab, setactiveTab: setactiveTab}} 
                legacyUrl={legacyUrl} />
              }>
                <Route index element={<Homepage />}/>
                <Route path="push-event" element={<PushEventMain />}/>
                {pageListRoute.map((pageName, index) => {
                  return (
                    <Route key={index} path={`${pageName}`} element={<ChecklistCollectionPage pageName={`${pageName}`}/>}/>
                  )
                })}
                {checklistPageRoute.map((checklist_page_ref, index) => {
                  return (
                    <Route key={index} path={`checklist-page/${checklist_page_ref}`} element={<CheckListPage checklistRef={`${checklist_page_ref}`}/>}/>
                  )
                })}
              </Route>
            </Routes>
          </div>
        </Router>
      </body>
    </div>
  );
}

export default App;
