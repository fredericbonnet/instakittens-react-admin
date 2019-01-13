import generateAutoPhrases from 'picklejs/cypress';

import { setScreens, setElementSelector } from 'picklejs/common/variables';

import selectors from './selectors.json';
import screens from '../screens.json';

generateAutoPhrases();
setScreens(screens);
setElementSelector(selectors);
