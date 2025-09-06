import './App.css'
import 'leaflet/dist/leaflet.css';
import MapWidget from './components/Map';
function App() {

  return (
    <>
      <MapWidget startingCoordinates={{lattitude: 39.2905, longitude:-76.6104}}
          mapMarkers={[]} height='400px' width='400px' />
    </>
  )
}

export default App
