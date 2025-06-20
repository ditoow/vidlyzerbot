// Radio station configurations
const stations = {
    lofi: {
        name: 'Lofi Hip Hop 24/7',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        genre: 'Lofi Hip Hop',
        description: 'Chill lofi hip hop beats for studying and relaxing',
        thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg',
        emoji: '🎵'
    },
    jazz: {
        name: 'Smooth Jazz Radio',
        url: 'https://www.youtube.com/watch?v=neV3EPgvZ3g',
        genre: 'Jazz',
        description: 'Smooth jazz music for a relaxing atmosphere',
        thumbnail: 'https://i.ytimg.com/vi/neV3EPgvZ3g/maxresdefault.jpg',
        emoji: '🎷'
    },
    pop: {
        name: 'Top Pop Hits',
        url: 'https://www.youtube.com/watch?v=36YnV9STBqc',
        genre: 'Pop',
        description: 'Latest and greatest pop hits',
        thumbnail: 'https://i.ytimg.com/vi/36YnV9STBqc/maxresdefault.jpg',
        emoji: '🎤'
    },
    rock: {
        name: 'Classic Rock Radio',
        url: 'https://www.youtube.com/watch?v=1TO48Cnl66w',
        genre: 'Rock',
        description: 'Classic rock hits from the golden era',
        thumbnail: 'https://i.ytimg.com/vi/1TO48Cnl66w/maxresdefault.jpg',
        emoji: '🎸'
    },
    electronic: {
        name: 'Electronic/EDM Radio',
        url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
        genre: 'Electronic',
        description: 'Electronic dance music and EDM beats',
        thumbnail: 'https://i.ytimg.com/vi/4xDzrJKXOOY/maxresdefault.jpg',
        emoji: '🎧'
    },
    classical: {
        name: 'Classical Music Radio',
        url: 'https://www.youtube.com/watch?v=jgpJVI3tDbY',
        genre: 'Classical',
        description: 'Beautiful classical music compositions',
        thumbnail: 'https://i.ytimg.com/vi/jgpJVI3tDbY/maxresdefault.jpg',
        emoji: '🎼'
    },
    ambient: {
        name: 'Ambient Soundscapes',
        url: 'https://www.youtube.com/watch?v=DWcJFNfaw9c',
        genre: 'Ambient',
        description: 'Peaceful ambient sounds for focus and relaxation',
        thumbnail: 'https://i.ytimg.com/vi/DWcJFNfaw9c/maxresdefault.jpg',
        emoji: '🌊'
    },
    synthwave: {
        name: 'Synthwave Radio',
        url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
        genre: 'Synthwave',
        description: 'Retro synthwave and outrun music',
        thumbnail: 'https://i.ytimg.com/vi/4xDzrJKXOOY/maxresdefault.jpg',
        emoji: '🌆'
    }
};

module.exports = {
    stations,
    
    // Get station by key
    getStation(key) {
        return stations[key.toLowerCase()];
    },
    
    // Get all station keys
    getStationKeys() {
        return Object.keys(stations);
    },
    
    // Get all stations as array
    getAllStations() {
        return Object.entries(stations).map(([key, station]) => ({
            key,
            ...station
        }));
    },
    
    // Search stations by name or genre
    searchStations(query) {
        const searchTerm = query.toLowerCase();
        return Object.entries(stations).filter(([key, station]) => 
            key.includes(searchTerm) || 
            station.name.toLowerCase().includes(searchTerm) ||
            station.genre.toLowerCase().includes(searchTerm) ||
            station.description.toLowerCase().includes(searchTerm)
        ).map(([key, station]) => ({ key, ...station }));
    }
};