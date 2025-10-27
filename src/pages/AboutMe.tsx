import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { HomepageBackendService } from "../services/HomePageBackendService";
import type { ListItem } from "../sharedTypes/WidgetListTypes";
import ListWidget from "../components/WidgetList";

declare global {
  interface Window {
    instgrm: any;
  }
}

function AboutMe() {
    const backEndService = new HomepageBackendService();
    const [recentSteamGames, setRecentSteamGames] = useState(Array<ListItem>(0));
    const [recentMusicTracks, setRecentMusicTracks] = useState(Array<ListItem>(0));
    const [currentReadingBooks, setCurrentlyReadingBooks] = useState(Array<ListItem>(0));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const recents = await backEndService.getRecentInterests();
                setRecentSteamGames(recents.games);
                setRecentMusicTracks(recents.songs);
                setCurrentlyReadingBooks(recents.books);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
    }, [recentSteamGames, recentMusicTracks, currentReadingBooks]); 
    return (
        <div className="about-me-page w-100">
            <section className="py-5 bg-white">
                <Container>
                    <h1 className="mb-5 text-dark">About Me</h1>
                    <Row className="mb-4">
                        <Col xs={12} md={6} lg={6}>
                            <img 
                                src="images/badlands.jpg" 
                                alt="Me in Badlands National Park in South Dakota."
                                className="img-fluid rounded"
                                style={{ width: "100%", height: "auto", objectFit: "cover" }}
                            />
                        </Col>
                        <Col xs={12} md={6} lg={6}>
                        <Row className="mb-4">
                            <Col xs={12}>
                                <ListWidget 
                                    title={'Recently Played Steam Games'} 
                                    items={recentSteamGames} 
                                />
                            </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col xs={12}>
                                    <ListWidget 
                                        title={'Recently Listened to Songs'} 
                                        items={recentMusicTracks} 
                                    />
                                </Col>
                            </Row>

                            <Row className="mb-4">
                                <Col xs={12}>
                                    <ListWidget 
                                        title={'Books Currently Reading'} 
                                        items={currentReadingBooks} 
                                    />
                                </Col>
                            </Row>


                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <iframe src="https://ehrencreative.de/github-profile-showcase/iframer/?user=JoeAB&hide-chart=false&hide-pinned=false&font-family=poppins%2C+arial&card-border-radius=2em&color-text=%23c41e3a&color-1=%23f59e0b&color-2=%23ff6b94&color-secondary=%23b12b31&color-background=%23f9f7f5&base-font-size=15px" width="100%" height="600" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <blockquote
                                className="instagram-media"
                                data-instgrm-permalink="https://www.instagram.com/jab6677/?utm_source=ig_embed&utm_campaign=loading"
                                data-instgrm-version="14"
                                style={{
                                background: "#FFF",
                                border: 0,
                                borderRadius: "3px",
                                boxShadow:
                                "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
                                margin: "1px",
                                maxWidth: "540px",
                                minWidth: "326px",
                                padding: 0,
                                width: "calc(100% - 2px)",
                                }}      
                            />                              
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default AboutMe;