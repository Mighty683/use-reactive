import React from 'react';
import useReactive from '../dist';
import { shallow } from 'enzyme';

const renderSpy = jest.fn();

const TestComponent = () => {
  let observable = useReactive(1);
  renderSpy();
  return <>
    <div>{observable.value}</div>
    <button
      title={'Increment'}
      onClick={() => {
        observable.value = 2;
      }}
    />
  </>;
};

describe('useReactive Hook', () => {
  afterEach(() => {
    renderSpy.mockClear();
  });

  describe('rendering', () => {
    it('should render proper value', () => {
      const element = shallow(<TestComponent />);

      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(element.children('div').text()).toBe('1');
    });
    it('should re-render on value change', () => {
      const element = shallow(<TestComponent />)

      element.children('button').simulate('click');

      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });
});
