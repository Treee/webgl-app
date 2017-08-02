import { WebglAppPage } from './app.po';

describe('webgl-app App', () => {
  let page: WebglAppPage;

  beforeEach(() => {
    page = new WebglAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
