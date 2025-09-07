import { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import type { ListItem } from "../sharedTypes/WidgetListTypes";

interface ListWidgetParameters {
    title: string;
    items: ListItem[];
    itemWidth?: number;
    itemHeight?: number;
}

const ListWidget: React.FC<ListWidgetParameters> = ({ 
    title, 
    items, 
    itemWidth = 120, 
    itemHeight = 160 
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateVisibleItems = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const gap = 12; // 12px gap between items
                const itemsPerView = Math.floor((containerWidth + gap) / (itemWidth + gap));
                setVisibleItems(Math.max(1, itemsPerView));
            }
        };

        updateVisibleItems();
        window.addEventListener('resize', updateVisibleItems);
        return () => window.removeEventListener('resize', updateVisibleItems);
    }, [itemWidth]);

    const maxIndex = Math.max(0, items.length - visibleItems);
    const canScrollLeft = currentIndex > 0;
    const canScrollRight = currentIndex < maxIndex;

    const scrollLeft = () => {
        if (canScrollLeft) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const scrollRight = () => {
        if (canScrollRight) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleItemClick = (link: string) => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    return (
        <Container fluid className="px-0">
            {/* Header with title and navigation arrows */}
            <Row className="align-items-center justify-content-between mb-3">
                <Col>
                    <h2 className="h5 mb-0 text-muted fw-normal">{title}</h2>
                </Col>
                {items.length > visibleItems && (
                    <Col xs="auto">
                        <div className="d-flex gap-1">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={scrollLeft}
                                disabled={!canScrollLeft}
                                className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                                style={{ width: '32px', height: '32px' }}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                </svg>
                            </Button>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={scrollRight}
                                disabled={!canScrollRight}
                                className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                                style={{ width: '32px', height: '32px' }}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                                </svg>
                            </Button>
                        </div>
                    </Col>
                )}
            </Row>
            
            <div className="overflow-hidden w-100" ref={containerRef}>
                <div 
                    className="d-flex flex-row gap-3 transition-transform"
                    style={{
                        transform: `translateX(-${currentIndex * (itemWidth + 12)}px)`,
                        transition: 'transform 0.3s ease-out'
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0"
                            style={{ 
                                width: itemWidth, 
                                height: itemHeight + 40,
                                cursor: 'pointer'
                            }}
                            onClick={() => handleItemClick(item.link)}
                        >
                            {/* Image container */}
                            <div 
                                className="rounded overflow-hidden bg-light position-relative"
                                style={{ 
                                    height: itemHeight, 
                                    width: itemWidth,
                                    transition: 'box-shadow 0.2s ease, transform 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
                                    const img = e.currentTarget.querySelector('img') as HTMLImageElement;
                                    if (img) img.style.transform = 'scale(1.02)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '';
                                    const img = e.currentTarget.querySelector('img') as HTMLImageElement;
                                    if (img) img.style.transform = 'scale(1)';
                                }}
                            >
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-100 h-100"
                                    style={{ 
                                        objectFit: 'cover',
                                        transition: 'transform 0.2s ease'
                                    }}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                                            `<svg width="${itemWidth}" height="${itemHeight}" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="100%" height="100%" fill="#f8f9fa"/>
                                                <rect x="40%" y="40%" width="20%" height="20%" fill="#dee2e6"/>
                                            </svg>`
                                        )}`;
                                    }}
                                />
                            </div>
                            {/* Title */}
                            <p 
                                className="mt-2 small text-muted text-center mb-0 lh-sm"
                                style={{
                                    transition: 'color 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#495057';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '';
                                }}
                            >
                                {item.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
};

export default ListWidget;