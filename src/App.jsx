import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import SubjectManagementPage from "./pages/SubjectManagementPage";
import SubjectWorkloadPage from "./pages/SubjectWorkloadPage";
import WorkloadDistributionPage from "./pages/WorkloadDistributionPage";
import { WorkloadProvider } from "./WorkloadContext";

export default function App() {
  return (
 <Router>


    
    {/* <BrowserRouter> */}
    <WorkloadProvider>
      <Routes>
        {/* The root path '/' will render the subject management page. */}
        <Route path="/" element={<SubjectManagementPage/>} />
        
        {/* This path '/subject/:subjectId' will render the workload page for a specific subject. */}
        <Route path="/subject/:subjectId" element={<SubjectWorkloadPage/>} />

        {/* ADD THIS NEW ROUTE */}
        <Route path="/workload-distribution" element={<WorkloadDistributionPage />} />
      </Routes>
      </WorkloadProvider>
     {/* </BrowserRouter>  */}
     </Router>
  );
}
