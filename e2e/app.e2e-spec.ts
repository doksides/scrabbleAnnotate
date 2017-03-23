import { ScrabbleAppPage } from './app.po';

describe('scrabble-app App', () => {
  let page: ScrabbleAppPage;

  beforeEach(() => {
    page = new ScrabbleAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
