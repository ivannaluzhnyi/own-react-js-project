import apiCall from '../../modules/api-service/api-service.js';
import config from './config.js';

async function searchUpcomingEventsByArtistName(artistName) {
    const { API_KEY, API_URL } = config;
    const url = `${API_URL}events.json?artist_name=${artistName}&apikey=${API_KEY}`;
    return apiCall({ method: 'GET', url });
}

async function searchEventsByLocationClient(per_page, page) {
    const { API_KEY, API_URL } = config;

    const getUrlRequest = ({ latitude, longitude }) =>
        `${API_URL}events.json?location=geo:${latitude},${longitude}&per_page=${per_page}&page=${page}&apikey=${API_KEY}`;

    const callRequest = async geolocation =>
        apiCall({
            method: 'GET',
            url: getUrlRequest(geolocation),
        })
            .then(res => res.json())
            .then(rest => {
                if (
                    rest.resultsPage !== undefined &&
                    rest.resultsPage.status === 'ok'
                ) {
                    return rest.resultsPage.results.event;
                }

                return rest.resultsPage;
            });

    if (navigator.geolocation) {
        // Call getCurrentPosition with success and failure callbacks
        navigator.geolocation.getCurrentPosition(
            props => {
                const { coords } = props;

                if (coords.latitude && coords.longitude) {
                    return callRequest(coords);
                }

                return callRequest(config.defaultGeolocation);
            },

            () => console.log('err geolocation'),
        );
    }

    return callRequest(config.defaultGeolocation);
}

export { searchUpcomingEventsByArtistName, searchEventsByLocationClient };
