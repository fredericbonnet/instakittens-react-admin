describe('Server', () => {
  it('should be listening', async () => {
    await page.goto(global.SERVER_ADDRESS);
  });
});
