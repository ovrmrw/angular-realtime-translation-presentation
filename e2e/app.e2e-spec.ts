import { JserinfoPage } from './app.po';

describe('jserinfo App', function() {
  let page: JserinfoPage;

  beforeEach(() => {
    page = new JserinfoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
