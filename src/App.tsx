import './App.css'
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MapWidget from './components/Map';
import { useEffect, useState } from 'react';
import type { MapMarker } from './sharedTypes/GeoCoordinateTypes';
import { readContractData } from './services/DesitnationLedgerService';
import ListWidget from './components/WidgetList';
import { HomepageBackendService } from './services/HomePageBackendService';
import type { ListItem } from './sharedTypes/WidgetListTypes';
import StarMap from './components/StarMap';
function App() {
  const backEndService = new HomepageBackendService();

  const[destinationsVisited, setDestinationsVistied] = useState(Array<MapMarker>(0));
  const[recentSteamGames, setRecentSteamGames] = useState(Array<ListItem>(0));
  const[recentMusicTracks, setRecentMusicTracks] = useState(Array<ListItem>(0));
  const[currentReadingBooks, setCurrentlyReadingBooks] = useState(Array<ListItem>(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const musicListItems = await backEndService.getRecentlyListenedToTracks();
        setRecentMusicTracks(musicListItems);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesListItems = await backEndService.getRecentlyPlayedSteamGames();
        setRecentSteamGames(gamesListItems);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookListItems = await backEndService.getCurrentReadingBooks();
        setCurrentlyReadingBooks(bookListItems);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locations = await readContractData();
        setDestinationsVistied(locations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchData();
  }, []);

  

  return (
    <>
      <ListWidget title={'Recently Played Steam Games'} items={recentSteamGames} />
      <br />
      <ListWidget title={'Recently Listened to Songs'} items={recentMusicTracks} />
      <br />
      <ListWidget title={'Books Currently Reading'} items={currentReadingBooks} />

      <MapWidget startingCoordinates={{lattitude: 39.2905, longitude:-76.6104}}
          mapMarkers={destinationsVisited} height='400px' width='600px' />
          <br />
          <StarMap />
    </>
  )
}

export default App
