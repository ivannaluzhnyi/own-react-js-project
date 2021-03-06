import React from '../../../modules/React/index.js';
import Button from '../../components/Button/Button.js';
import { searchEventsByLocationClient } from '../../apis/event.js';

import EventMapItem from './EventMapItem.js';
import { isEmpty } from '../../utils/helper.js';

class EventContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            events: [],
            loadedPageEvent: 1,
        };
    }

    componentDidMount = async () => {
        const { loadedPageEvent } = this.state;

        const res = await searchEventsByLocationClient(10, loadedPageEvent);

        console.log('events => ', res);

        localStorage.setItem('events_component_mount', JSON.stringify(res));
        this.setState({ events: [...res] });
    };

    handleLoadPlusEvent = async () => {
        const { events, loadedPageEvent } = this.state;
        const newLoadedPage = loadedPageEvent + 1;
        const res = await searchEventsByLocationClient(10, newLoadedPage);

        // console.log('handleLoadPlusEvent => ', res);

        this.setState({
            loadedPageEvent: newLoadedPage,
            events: [...events, ...res],
        });
    };

    render() {
        const { events } = this.state;

        let upEvents = events;

        if (isEmpty(events)) {
            const localEvants = localStorage.getItem('events_component_mount');

            if (localEvants !== null) {
                upEvents = JSON.parse(localEvants);
            }
        }

        return React.createElement(
            'div',
            { className: 'event-container' },

            React.createElement(
                'section',
                {},

                React.createElement('h3', {}, 'Upcoming events '),

                React.createElement(
                    'div',
                    { className: 'row' },

                    ...upEvents.map(event =>
                        React.createElement(EventMapItem, { event }),
                    ),
                ),

                React.createElement(
                    'div',
                    { className: 'col 12' },

                    React.createElement(
                        Button,
                        {
                            ...Button.props({
                                title: "Charger plus d'événements ... ",
                                onClick: () => this.handleLoadPlusEvent(),
                            }),
                        },
                        null,
                    ),
                ),
            ),
        );
    }
}

export default EventContainer;
