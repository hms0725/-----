import {css, FlattenSimpleInterpolation} from 'styled-components';
import {DISPLAY_MAX_WIDTH} from './constants/display';
import {NAV_HEIGHT} from './constants/height';

const mobile = (styles: string, ...args: any[]) => {
  let style = styles;

  if (styles.length > 1) {
    style = '';

    for (let i = 0; i < styles.length; i++) {
      style += styles[i];

      if (args[i]) {
        style += args[i];
      }
    }
  }

  return css`
    @media only screen and (max-width: ${DISPLAY_MAX_WIDTH}px) {
      ${style}
    }
  `;
};

class Typo {
  constructor(
    public fontSize: string = '14px',
    public lineHeight: string = '20px',
    public fontWeight: string = 'normal'
  ) {
  }

  toCSS(): FlattenSimpleInterpolation {
    return css`
      font-size: ${this.fontSize};
      font-weight: ${this.fontWeight};
      line-height: ${this.lineHeight};
    `
  }
}

const theme = {
  mobile,
  dimens: {
    navHeight: NAV_HEIGHT,
    tabHeight: 53,
  },
  zIndex: {
    appHeader: 100,
    dimmer: 5,
  },
  color: {
    error: '#ff4627',
    black: '#17171B',
    white: '#FFFFFF',
    gray: '#E5E7EB',
    coral030: '#EB5757',
    coral040: '#FF583B',
    coral050: '#FF6557',
    coral060: '#F3817B',
    coral070: '#F9A4A0',
    coral080: '#FFD3D6',
    navy050: '#007EFF',
    navy060: '#008DFF',
    red050: '#F26175',
    yellow050: '#FFD324',
    yellow060: '#FFF028',
    gray005: '#171B1C',
    gray010: '#1E2427',
    gray020: '#2E363A',
    gray030: '#41474C',
    gray040: '#5A6166',
    gray050: '#999FA4',
    gray060: '#C5C8CE',
    gray070: '#F7F8F9',
    gray080: '#FDFDFD',
    //Runner Renewal
    black100: '#F0F0F0',
    black200: '#B7B7B7',
    black300: '#808080',
    black400: '#444444',
    black500: '#202020',
    purple100: '#F0EAFF',
    purple200: '#8359F7',
    purple300: '#6436E7',
    purple400: '#402295',
    purple500: '#2C1C5A',
  },
  typo: {
    h1: new Typo('28px', '36px', '600'),
    h2: new Typo('24px', '32px', '600'),
    subtitle1: new Typo('18px', '24px', '600'),
    subtitle2: new Typo('16px', '24px', '600'),
    subtitle3: new Typo('14px', '20px', '600'),
    subtitle4: new Typo('12px', '18px', '600'),
    subtitle5: new Typo('10px', '12px', '600'), // 2021.10.18 추가 - arden
    body1: new Typo('16px', '24px', 'normal'),
    body2: new Typo('14px', '20px', 'normal'),
    caption1: new Typo('12px', '18px', 'normal'),
    caption2: new Typo('10px', '12px', '600'),
    caption3: new Typo('10px', '12px', 'normal')
  }
};


export default theme
