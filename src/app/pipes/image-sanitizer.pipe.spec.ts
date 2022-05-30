import { ImageSanitizerPipe } from './image-sanitizer.pipe';

describe('ImageSanitizerPipe', () => {
  it('create an instance', () => {
    const pipe = new ImageSanitizerPipe();
    expect(pipe).toBeTruthy();
  });
});
