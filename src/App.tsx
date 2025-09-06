import './App.css'
import 'leaflet/dist/leaflet.css';
import MapWidget from './components/map';
function App() {

  return (
    <>
      <MapWidget mapMarkers={[]} />
    </>
  )
}

export default App
