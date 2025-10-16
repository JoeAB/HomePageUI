import {  useState, useEffect } from "react";
import { HomepageBackendService } from "../services/HomePageBackendService";
import type { ListItem } from "../sharedTypes/WidgetListTypes";
import ListWidget from "../components/WidgetList";

function AboutMe() {
    const backEndService = new HomepageBackendService();
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

      return (
        <>
            <ListWidget title={'Recently Played Steam Games'} items={recentSteamGames} />
            <br />
            <ListWidget title={'Recently Listened to Songs'} items={recentMusicTracks} />
            <br />
            <ListWidget title={'Books Currently Reading'} items={currentReadingBooks} />
        </>
    );
}

export default AboutMe;