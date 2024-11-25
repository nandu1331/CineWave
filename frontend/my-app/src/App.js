import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Row from './components/row';
import requests from './requests';
import Register from './components/register';
import BrowseContent from './components/BrowseContent';
import MyList from './components/MyList';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <div className="app">
                            <Navbar />
                            <Banner />
                            <Row title="Now Playing" fetchUrl={requests.fetchNowPlaying} isBig={true} media_type={'Movie'}/>
                            <Row title="Popular" fetchUrl={requests.fetchPopular} media_type={'Movie'}/>         
                            <Row title="Top-Rated" fetchUrl={requests.fetchToprated} media_type={'Movie'}/>
                            <Row title="Upcoming" fetchUrl={requests.fetchUpcoming} media_type={'Movie'}/>
                            <Row title="Anime" fetchUrl={requests.fetchAnime} media_type={'Anime'}/>
                            <Row title="Tv shows" fetchUrl={requests.fetchTvShows} media_type={'TV'}/>
                        </div>
                    </ProtectedRoute>
                } />
                <Route path="/browse/:category" element={
                    <ProtectedRoute>
                        <div className="app">
                            <Navbar />
                            <BrowseContent />
                        </div>
                    </ProtectedRoute>
                } />
                <Route path="/mylist" element={
                    <ProtectedRoute>
                        <div className='app'>
                            <Navbar />
                            <MyList />
                        </div>
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

