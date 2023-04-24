
import Routers from './routes/Router';
import "./App.css"
import Navbar from './components/navbar';
import LeftSidebar from './components/sidebar/LeftSidebar';
import RightSidebar from './components/sidebar/RightSidebar';

const App: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <div className="" style={{ marginTop: '3.5rem', minHeight: 'calc(100% - 4rem)' }} >
        <div className="w-full h-full grid grid-cols-7">
          <div className="col-span-2 flex justify-start ml-2">
            <LeftSidebar />
          </div>
          <div className="col-span-3 h-full">
            <Routers />
          </div>
          <div className="col-span-2 flex justify-end pr-2">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
