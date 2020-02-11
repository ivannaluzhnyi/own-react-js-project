/* eslint-disable new-cap */
import {
    isStateLessComponent,
    type_check_v1,
    isClass,
    checkIfClassExist,
} from './react-utils.js';
import { setAttribute } from './dom.js';

import PropTypes from '../PropTypes/PropTypes.js';

const mountedComponents = [];

export const createElement = (element, properties, ...children) => {
    if (isClass(element)) {
        const component = new element(properties);

        if (component.propTypes) {
            PropTypes.checkPropTypes(
                component.propTypes,
                properties,
                component.getClassName(),
            );
        }

        if (
            !checkIfClassExist(mountedComponents, component) &&
            component.componentDidMount
        ) {
            component.componentDidMount();
        }

        mountedComponents.push(component.getClassName());

        // console.log('component => ', component);

        component.componentDidUpdate = () => {
            console.log(
                're render componentDidUpdate ==> ',
                component.display(),
            );
        };
        return component.render();
    }

    if (isStateLessComponent(element)) {
        if (element.propTypes) {
            PropTypes.checkPropTypes(
                element.propTypes,
                properties,
                element.name,
            );
        }

        return element(properties);
    }

    const domElement = document.createElement(element);

    children.forEach(child => {
        if (type_check_v1(child, 'object')) {
            domElement.appendChild(child);
        } else {
            domElement.textContent += child;
        }
    });

    if (properties !== null)
        Object.keys(properties).forEach(propertyName =>
            setAttribute(domElement, propertyName, properties[propertyName]),
        );

    return domElement;
};