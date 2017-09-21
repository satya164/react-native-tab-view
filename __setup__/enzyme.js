import { configure } from 'enzyme';
import Adapter from 'enzyme/build/adapters/ReactSixteenAdapter';

configure({ adapter: new Adapter() });
