import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { createMount, act, createClientRender, fireEvent, describeConformanceV5 } from 'test/utils';
import Link from './Link';
import Typography, { typographyClasses } from '../Typography';
import classes from './linkClasses';

function focusVisible(element) {
  act(() => {
    element.blur();
    document.dispatchEvent(new window.Event('keydown'));
    element.focus();
  });
}

describe('<Link />', () => {
  const mount = createMount();
  const render = createClientRender();

  describeConformanceV5(<Link href="/">Home</Link>, () => ({
    classes,
    inheritComponent: Typography,
    mount,
    muiName: 'MuiLink',
    refInstanceof: window.HTMLAnchorElement,
    testVariantProps: { color: 'secondary', variant: 'h1' },
    testStateOverrides: { prop: 'underline', value: 'always', styleKey: 'underlineAlways' },
    skip: ['componentsProp'],
  }));

  it('should render children', () => {
    const { queryByText } = render(<Link href="/">Home</Link>);

    expect(queryByText('Home')).to.not.equal(null);
  });

  it('should pass props to the <Typography> component', () => {
    const { container } = render(
      <Link href="/" color="primary">
        Test
      </Link>,
    );
    expect(container.firstChild).to.have.class(typographyClasses.colorPrimary);
  });

  describe('event callbacks', () => {
    it('should fire event callbacks', () => {
      const events = ['onBlur', 'onFocus'];

      const handlers = events.reduce((result, n) => {
        result[n] = spy();
        return result;
      }, {});

      const { container } = render(
        <Link href="/" {...handlers}>
          Home
        </Link>,
      );
      const anchor = container.querySelector('a');

      events.forEach((n) => {
        const event = n.charAt(2).toLowerCase() + n.slice(3);
        fireEvent[event](anchor);
        expect(handlers[n].callCount).to.equal(1);
      });
    });
  });

  describe('keyboard focus', () => {
    it('should add the focusVisible class when focused', () => {
      const { container } = render(<Link href="/">Home</Link>);
      const anchor = container.querySelector('a');

      expect(anchor).to.not.have.class(classes.focusVisible);

      focusVisible(anchor);

      expect(anchor).to.have.class(classes.focusVisible);

      act(() => {
        anchor.blur();
      });

      expect(anchor).to.not.have.class(classes.focusVisible);
    });
  });
});
