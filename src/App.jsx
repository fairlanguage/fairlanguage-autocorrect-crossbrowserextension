import React, { Fragment, Component } from 'react';

import log from './helpers/helper-logger';

import ComponentToolbar from './components/component-toolbar';
import ComponentWidget from './components/component-widget';

import ModulePlacingGoogle from './modules/placing/google';
import ModulePlacingZalando from './modules/placing/zalando';
import ModulePlacingSlack from './modules/placing/slack';
import ModulePlacingMessenger from './modules/placing/messenger';
import ModulePlacingWhatsapp from './modules/placing/whatsapp';
import ModulePlacingTelegram from './modules/placing/telegram';

import ModulePlacingFacebook from './modules/placing/facebook';


import config from '../config';

const dev = false;

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      textFields: [],
    };
  }

  componentDidMount() {

    log('* Fairlanguage 0.6 - App');

    window.addEventListener('click', (event) => {

      log('Detecting `elementClickedOn`');

      const elementClickedOn = event.target;

      if (dev) elementClickedOn.style.background = 'lightblue';
      if (dev) console.log(elementClickedOn);

      /*
      *  First, check if it's ours.
      */
      let isAlreadyInjected;

      // Is the element is our general container itself?
      isAlreadyInjected = (elementClickedOn.id === 'fairlanguage-container');

      isAlreadyInjected = (elementClickedOn.id === 'fairlanguage-container');

      // Do the element's child elements have our 'attribute' (most likely).
      elementClickedOn.parentNode.childNodes.forEach((node) => {
        isAlreadyInjected = node.hasAttribut ? node.hasAttribute('fl') : false;
      });

      log(`isAlreadyInjected: ${isAlreadyInjected}`);

      if (isAlreadyInjected) return;

      /*
      *  Second, check if the element is any kind of text field.
      */

      // Is the element itself a HTML TextArea element?
      const isTextArea = elementClickedOn.type === 'textarea';
      log(`isTextArea: ${isTextArea}`);

      // Is the element an input element?
      const isIn = elementClickedOn.tagName.toLowerCase() === 'input';
      log(`isIn: ${isIn}`);

      // Is the element's type input?
      const isInput = elementClickedOn.type === 'input';
      log(`isInput: ${isInput}`);

      // Is the element's type search?
      const isSearch = elementClickedOn.type === 'search';
      log(`isSearch: ${isSearch}`);

      // Is the element itself content editable?
      const isContentEditable = elementClickedOn.hasAttribute('contenteditable');
      log(`isContentIsEditable: ${isContentEditable}`);

      // Is a parent element's content editable?
      let isParentElementContentIsEditable;

      const maxDepth = 10;

      let depth = 0;
      let el = elementClickedOn;
      while (!isParentElementContentIsEditable && depth <= maxDepth) {
        isParentElementContentIsEditable = el.hasAttribute('contenteditable');
        el = el.parentNode;
        depth += 1;
      }

      log(`isParentElementContentIsEditable (${depth}): ${isParentElementContentIsEditable}`);

      // If none of that is the case it just wasn't a txt field (sorry :/).
      if (!isTextArea && !isIn && !isInput && !isSearch && !isContentEditable && !isParentElementContentIsEditable) return;

      /*
      *  Third, we decide where to place the fucking widget!
      */

      const textFields = this.state.textFields;

      let textElement;
      let widgetContainer;

      // Do we have a custom idea for the webapp?
      let hasCustomPosition = false;
      if (window.location.href.includes('slack.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingSlack(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else 
      
      if (window.location.href.includes('google.com')) {

        hasCustomPosition = true

        const e = ModulePlacingGoogle(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else 
      
      if (window.location.href.includes('facebook.com')) {

        hasCustomPosition = true

        const e = ModulePlacingFacebook(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else  
      
      if (window.location.href.includes('en.zalando.de')) {

        hasCustomPosition = true

        const e = ModulePlacingZalando(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else 
      
      if (window.location.href.includes('messenger.com')) {

        hasCustomPosition = true

        const e = ModulePlacingMessenger(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else 
      
      if (window.location.href.includes('whatsapp.com')) {

        hasCustomPosition = true;

        const e = ModulePlacingWhatsapp(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else 
      
      if (window.location.href.includes('telegram.org')) {

        hasCustomPosition = true;

        const e = ModulePlacingTelegram(elementClickedOn);
        textElement = e[0]
        widgetContainer = e[1]

      } else {

      /*
      * We don't have a custom position for this app, so just place it inside the parent node.
      */

        const parentElement = isParentElementContentIsEditable ? elementClickedOn.parentNode.parentNode : elementClickedOn.parentNode;
        
        textElement = elementClickedOn;
        widgetContainer = parentElement;

      }

      log(`hasCustomPosition: ${hasCustomPosition}`)

      textFields.push([textElement, widgetContainer]);

      this.setState({
        textFields,
      });

      log(`$ Detected textElement #${textFields.length}`);

    });

  }

  render() {
    return (
      <Fragment>
        {config.default.toolbar ? <ComponentToolbar /> : ''}
        {
          this.state.textFields.map((el, index) => (
            <ComponentWidget
              key={index}
              textElement={el[0]}
              containerElement={el[1]}
            />
          ))
        }
      </Fragment>
    );
  }
}
